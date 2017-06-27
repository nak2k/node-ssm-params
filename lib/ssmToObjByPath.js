const { getAllParametersByPath } = require('./getAllParametersByPath');
const { parametersToObj } = require('./parametersToObj');

exports.ssmToObjByPath = ssmToObjByPath;

function ssmToObjByPath(options, callback) {
  if (typeof options === 'string') {
    options = {
      Path: options,
    };
  }

  const params = {
    Path: options.Path,
    Recursive: options.Recursive || options.nestObject,
    ParameterFilters: options.ParameterFilters,
    WithDecryption: options.WithDecryption,
  };

  getAllParametersByPath(params, (err, data) => {
    if (err) {
      return callback(err);
    }

    parametersToObj(options, data, callback);
  });
}
