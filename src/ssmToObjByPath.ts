import { SSM } from 'aws-sdk';
import { getAllParametersByPath } from './getAllParametersByPath';
import { parametersToObj, ParametersToObjOptions } from './parametersToObj';

export interface SsmToObjByPathOptions extends ParametersToObjOptions {
  Recursive?: boolean;
  ParameterFilters?: SSM.ParameterStringFilterList;
  WithDecryption?: boolean;
}

export async function ssmToObjByPath(options: string | SsmToObjByPathOptions) {
  if (typeof options === 'string') {
    options = {
      Path: options,
    };
  }

  const data = await getAllParametersByPath({
    Path: options.Path,
    Recursive: options.Recursive || options.nestObject,
    ParameterFilters: options.ParameterFilters,
    WithDecryption: options.WithDecryption,
  });

  return parametersToObj(options, data);
}
