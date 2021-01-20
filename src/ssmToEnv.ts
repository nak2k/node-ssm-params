import { ssmToObj } from './ssmToObj';
import { ssmToObjByPath } from './ssmToObjByPath';

export async function ssmToEnv(prefix: string, recursive?: boolean) {
  if (prefix[0] === '/') {
    return ssmToObjByPath({
      Path: prefix,
      Recursive: recursive,
      WithDecryption: true,
      target: process.env,
    });
  } else {
    return ssmToObj({ prefix, target: process.env, withDecryption: true });
  }
}
