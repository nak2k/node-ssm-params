const { queryParameterNamesWithPrefix } = require('./queryParameterNamesWithPrefix');
const { getAllParameters } = require('./getAllParameters');

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

    getAllParameters({ Names, WithDecryption: withDecryption }, (err, data) => {
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
