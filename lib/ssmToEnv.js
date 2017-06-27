const { ssmToObj } = require('./ssmToObj');
const { ssmToObjByPath } = require('./ssmToObjByPath');

exports.ssmToEnv = ssmToEnv;

function ssmToEnv(prefix, callback) {
  if (prefix[0] === '/') {
    ssmToObjByPath({
      Path: prefix,
      WithDecryption: true,
      target: process.env,
    }, callback);
  } else {
    ssmToObj({ prefix, target: process.env, withDecryption: true }, callback);
  }
}
