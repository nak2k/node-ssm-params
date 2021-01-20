import { queryParameterNamesWithPrefix } from './queryParameterNamesWithPrefix';
import { getAllParameters } from './getAllParameters';

export interface SsmToObjOptions {
  prefix: string;
  target?: any;
  withDecryption?: boolean;
}

export async function ssmToObj<T = any>(options: string | SsmToObjOptions): Promise<T> {
  if (typeof options === 'string') {
    options = {
      prefix: options,
    };
  }

  const { prefix, target = {}, withDecryption } = options;

  const Names = await queryParameterNamesWithPrefix(prefix);

  if (Names.length === 0) {
    return target;
  }

  const { Parameters, InvalidParameters } = await getAllParameters({ Names, WithDecryption: withDecryption });

  if (InvalidParameters && InvalidParameters.length > 0) {
    throw new Error(`Invalid parameter names : ${InvalidParameters.join(', ')}`);
  }

  if (!Parameters || Parameters.length === 0) {
    return target;
  }

  Parameters.forEach(({ Name, Value }) => {
    target[Name!.substr(prefix.length)] = Value;
  });

  return target;
}
