const { getSsm } = require('./getSsm');

exports.getAllParameters = getAllParameters;

function getAllParameters(params, callback) {
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
