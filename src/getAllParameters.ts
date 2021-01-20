import { AWSError, SSM } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

export async function getAllParameters(params: SSM.GetParametersRequest) {
  const ssm = new SSM();

  const { Names } = params;

  if (Names.length <= 10) {
    return ssm.getParameters(params).promise();
  }

  /*
   * Call getParameters in parallel for many names.
   */
  const { WithDecryption } = params;

  const promises = [] as Promise<PromiseResult<SSM.GetParametersResult, AWSError>>[];

  for (let i = 0; i < Names.length; i += 10) {
    promises.push(ssm.getParameters({ Names: Names.slice(i, i + 10), WithDecryption }).promise());
  }

  return Promise.all(promises).then(results => {
    const mergedData = {
      Parameters: [] as SSM.ParameterList,
      InvalidParameters: [] as SSM.ParameterNameList,
    };

    results.forEach(data => {
      mergedData.Parameters.push(...(data.Parameters || []));
      mergedData.InvalidParameters.push(...(data.InvalidParameters || []));
    });

    return mergedData;
  });
}
