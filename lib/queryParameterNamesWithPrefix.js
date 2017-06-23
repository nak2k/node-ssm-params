const { describeAllParameters } = require('./describeAllParameters');

exports.queryParameterNamesWithPrefix = queryParameterNamesWithPrefix;

function queryParameterNamesWithPrefix(prefix, callback) {
  const params = {
    ParameterFilters: [
      {
        Key: 'Name',
        Option: 'BeginsWith',
        Values: [prefix],
      },
    ],
  };

  describeAllParameters(params, (err, data) => {
    if (err) {
      return callback(err);
    }

    const { Parameters } = data;

    callback(null, Parameters.map(({ Name }) => Name));
  });
}
