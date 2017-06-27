const { ssmToObjByPath } = require('..');
const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_REGION || 'us-west-2' });

ssmToObjByPath({
  Path: '/foo/bar',
  nestObject: true,
}, (err, obj) => {
  if (err) {
    throw err;
  }

  /*
   * Result: {"baz":"hunter2"}
   */
  console.log("### Enable nestObject.\n%j", obj);
});

ssmToObjByPath({
  Path: '/foo/bar',
  nestObject: true,
  trimPath: false,
}, (err, obj) => {
  if (err) {
    throw err;
  }

  /*
   * Result: {"foo":{"bar":{"baz":"hunter2"}}}
   */
  console.log("### Enable nestObject, and disable trimPath.\n%j", obj);
});
