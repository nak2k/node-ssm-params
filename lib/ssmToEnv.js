const { ssmToObj } = require('./ssmToObj');

exports.ssmToEnv = ssmToEnv;

function ssmToEnv(prefix, callback) {
  ssmToObj({ prefix, target: process.env, withDecryption: true }, callback);
}
