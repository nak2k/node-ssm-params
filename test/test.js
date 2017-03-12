import test from 'tape';
import {
  ssmToObj,
  ssmToEnv,
} from '..';
import AWS from 'aws-sdk';

AWS.config.update({ region: process.env.AWS_REGION });

test('test ssmToObj', t => {
  t.plan(2);

  ssmToObj('test-ssm-params.obj.', (err, obj) => {
    t.error(err);
    t.equal(obj.TEST, 'test');
  });
});

test('test ssmToEnv', t => {
  t.plan(2);

  ssmToEnv('test-ssm-params.env.', err => {
    t.error(err);
    t.equal(process.env.TEST, 'test');
  });
});
