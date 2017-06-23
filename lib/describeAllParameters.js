const { getSsm } = require('./getSsm');

exports.describeAllParameters = describeAllParameters;

function describeAllParameters(params, callback) {
  const ssm = getSsm();

  function iterator(params, mergedData, callback) {
    ssm.describeParameters(params, (err, data) => {
      if (err) {
        return callback(err, null);
      }

      const { Parameters, NextToken } = data;

      Parameters.forEach(param => mergedData.Parameters.push(param));

      if (!NextToken) {
        return callback(null, mergedData);
      }

      params.NextToken = NextToken;

      iterator(params, mergedData, callback);
    });
  }

  iterator(Object.assign({}, params), { Parameters: [] }, callback);
}
