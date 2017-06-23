const { getSsm } = require('./getSsm');

exports.getAllParametersByPath = getAllParametersByPath;

function getAllParametersByPath(params, callback) {
  const ssm = getSsm();

  function iterator(params, mergedData, callback) {
    ssm.getParametersByPath(params, (err, data) => {
      if (err) {
        return callback(err, null);
      }

      mergedData.Parameters.push(...(data.Parameters || []));

      const { NextToken } = data;

      if (!NextToken) {
        return callback(null, mergedData);
      }

      params.NextToken = NextToken;

      iterator(params, mergedData, callback);
    });
  }

  iterator(Object.assign({}, params), { Parameters: [] }, callback);
}
