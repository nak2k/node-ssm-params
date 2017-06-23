const { getSsm } = require('./getSsm');
const { queryParameterNamesWithPrefix } = require('./queryParameterNamesWithPrefix');

exports.ssmToObj = ssmToObj;

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