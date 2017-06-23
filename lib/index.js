const AWS = require('aws-sdk');

exports.ssmToObj = ssmToObj;
exports.ssmToEnv = ssmToEnv;
exports.queryParameterNamesWithPrefix = queryParameterNamesWithPrefix;

let ssm = null;

function getSsm() {
  if (!ssm) {
    ssm = new AWS.SSM();
  }

  return ssm;
}

function ssmToObj(options, callback) {
  if (typeof options === 'string') {
    options = {
      prefix: options,
    };
  }

  const { prefix, target = {}, withDecryption } = options;

  queryParameterNamesWithPrefix(prefix, (err, Names) => {
    if (err) {
      return callback(err);
    }

    if (Names.length === 0) {
      return callback(null, target);
    }

    getParameters({ Names, WithDecryption: withDecryption }, (err, data) => {
      if (err) {
        return callback(err);
      }

      const { Parameters, InvalidParameters } = data;

      if (InvalidParameters && InvalidParameters.length > 0) {
        return callback(new Error(`Invalid parameter names : ${InvalidParameters.join(', ')}`));
      }

      if (Parameters.length === 0) {
        return callback(null, target);
      }

      Parameters.forEach(({ Name, Value }) => {
        target[Name.substr(prefix.length)] = Value;
      });

      callback(null, target);
    });
  });
}

function getParameters(params, callback) {
  const ssm = getSsm();

  const { Names } = params;

  if (Names.length <= 10) {
    return ssm.getParameters(params, callback);
  }

  /*
   * Call getParameters in parallel for many names.
   */
  const { WithDecryption } = params;
  const mergedData = {
    Parameters: [],
    InvalidParameters: [],
  };
  let count = (Names.length + 9) / 10 | 0;

  for (let i = 0; i < Names.length; i += 10) {
    ssm.getParameters({ Names: Names.slice(i, i + 10), WithDecryption }, (err, data) => {
      /*
       * If callback is called already, discard the data.
       */
      if (count <= 0) {
        return;
      }

      /*
       * Call the callback once only for an error.
       */
      if (err) {
        count = 0;
        return callback(err, null);
      }

      /*
       * Merge data.
       */
      mergedData.Parameters.push(...(data.Parameters || []));
      mergedData.InvalidParameters.push(...(data.InvalidParameters || []));

      /*
       * If all getParameters call is completed, call the callback with merged data.
       */
      if (--count === 0) {
        return callback(null, mergedData);
      }
    });
  }
}

function ssmToEnv(prefix, callback) {
  ssmToObj({ prefix, target: process.env, withDecryption: true }, callback);
}

function queryParameterNamesWithPrefix(prefix, callback) {
  const ssm = getSsm();

  const enumParameterNames = (result, params, callback) => {
    ssm.describeParameters(params, (err, data) => {
      if (err) {
        return callback(err);
      }

      const { Parameters, NextToken } = data;

      Parameters.forEach(({ Name }) => result.push(Name));

      if (!NextToken) {
        return callback(null, result);
      }

      params.NextToken = NextToken;

      enumParameterNames(result, params, callback);
    });
  };

  const params = {
    ParameterFilters: [
      {
        Key: 'Name',
        Option: 'BeginsWith',
        Values: [prefix],
      },
    ],
  };

  enumParameterNames([], params, callback);
}
