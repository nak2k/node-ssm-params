import * as test from 'tape';
import { ssmToObj, ssmToObjByPath, ssmToEnv } from '..';

test('test ssmToObj', async t => {
  t.plan(1);

  const obj = await ssmToObj('test-ssm-params.obj.');

  t.equal(obj.TEST, 'test');
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
test('test ssmToObj for many params', async t => {
  t.plan(1);

  const obj = await ssmToObj('test-ssm-params.many-params.');

  t.equal(Object.keys(obj).length, 20);
});

test('test ssmToEnv', async t => {
  t.plan(1);

  await ssmToEnv('test-ssm-params.env.');

  t.equal(process.env.TEST, 'test');
});

test('test ssmToEnv with hierarchy', async t => {
  t.plan(1);

  await ssmToEnv('/test-ssm-params/nestObject/foo');

  t.equal(process.env['value'], 'test');
});

test('test ssmToEnv with recursive', async t => {
  t.plan(1);

  await ssmToEnv('/test-ssm-params/nestObject', true);

  t.equal(process.env['foo/value'], 'test');
});

test('test ssmToObjByPath', async t => {
  t.plan(2);

  const obj = await ssmToObjByPath('/test-ssm-params/nestObject/foo');

  t.equal(typeof (obj), 'object');
  t.equal(obj['value'], 'test');
});

test('test ssmToObjByPath with nestObject', async t => {
  t.plan(3);

  const options = {
    Path: '/test-ssm-params/nestObject',
    nestObject: true,
  };

  const obj = await ssmToObjByPath(options);

  t.equal(typeof (obj), 'object');
  t.equal(typeof (obj.foo), 'object');
  t.equal(obj.foo.value, 'test');
});

test('test ssmToObjByPath with nestObject and no trimPath', async t => {
  t.plan(4);

  const options = {
    Path: '/test-ssm-params/nestObject',
    nestObject: true,
    trimPath: false,
  };

  const obj = await ssmToObjByPath(options);

  t.equal(typeof (obj), 'object');
  t.equal(typeof (obj['test-ssm-params']), 'object');
  t.equal(typeof (obj['test-ssm-params']['nestObject']), 'object');
  t.equal(obj['test-ssm-params']['nestObject'].foo.value, 'test');
});
