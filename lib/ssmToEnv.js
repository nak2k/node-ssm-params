const { ssmToObj } = require('./ssmToObj');
const { ssmToObjByPath } = require('./ssmToObjByPath');

exports.ssmToEnv = ssmToEnv;

function ssmToEnv(prefix, recursive, callback) {
  if (callback === undefined) {
    [recursive, callback] = [undefined, recursive];
  }

  if (prefix[0] === '/') {
    ssmToObjByPath({
      Path: prefix,
      Recursive: recursive,
      WithDecryption: true,
      target: process.env,
    }, callback);
  } else {
    ssmToObj({ prefix, target: process.env, withDecryption: true }, callback);
  }
}
