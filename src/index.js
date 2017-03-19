import AWS from 'aws-sdk';

let ssm = null;

function getSsm() {
  if (!ssm) {
    ssm = new AWS.SSM();
  }

  return ssm;
}

export function ssmToObj(options, callback) {
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

    const ssm = getSsm();

    ssm.getParameters({ Names, WithDecryption: withDecryption }, (err, data) => {
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

export function ssmToEnv(prefix, callback) {
  ssmToObj({ prefix, target: process.env }, callback);
}

export function queryParameterNamesWithPrefix(prefix, callback) {
  const ssm = getSsm();

  const enumParameterNames = (result, params, callback) => {
    ssm.describeParameters(params, (err, data) => {
      if (err) {
        return callback(err);
      }

      const { Parameters, NextToken } = data;

      Parameters.forEach(({ Name }) => {
        Name.startsWith(prefix) && result.push(Name);
      });

      if (!NextToken) {
        return callback(null, result);
      }

      enumParameterNames(result, { NextToken }, callback);
    });
  };

  enumParameterNames([], {}, callback);
}
