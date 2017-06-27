const repl = require('repl');
const ssmParams = require('.');
const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_REGION || 'us-west-2' });

const r = repl.start('> ');

Object.assign(r.context, ssmParams);
