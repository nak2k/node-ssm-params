exports.getSsm = getSsm;

let ssm = null;

function getSsm() {
  if (!ssm) {
    const AWS = require('aws-sdk');

    ssm = new AWS.SSM();
  }

  return ssm;
}
