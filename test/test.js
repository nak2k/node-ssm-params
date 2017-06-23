const test = require('tape');
const {
  ssmToObj,
  ssmToEnv,
} = require('..');
const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_REGION });

test('test ssmToObj', t => {
  t.plan(2);

  ssmToObj('test-ssm-params.obj.', (err, obj) => {
    t.error(err);
    t.equal(obj.TEST, 'test');
  });
});

/*
 * Run the following command in bash to make parameters for this test.
 *
 *   for i in $(seq 1 20); do aws ssm put-parameter --name "test-ssm-params.many-params.$i" --type String --value "$i"; done
 *
 * To clean up.
 *
 *   for i in $(seq 1 20); do aws ssm delete-parameter --name "test-ssm-params.many-params.$i"; done
 */
test('test ssmToObj for many params', t => {
  t.plan(2);

  ssmToObj('test-ssm-params.many-params.', (err, obj) => {
    t.error(err);
    t.equal(Object.keys(obj).length, 20);
  });
});

test('test ssmToEnv', t => {
  t.plan(2);

  ssmToEnv('test-ssm-params.env.', err => {
    t.error(err);
    t.equal(process.env.TEST, 'test');
  });
});
