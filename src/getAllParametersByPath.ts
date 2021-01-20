import { SSM } from 'aws-sdk';

export async function getAllParametersByPath(params: SSM.GetParametersByPathRequest) {
  const ssm = new SSM();

  const mergedData = { Parameters: [] as SSM.ParameterList };
  for (; ;) {
    const { Parameters, NextToken } = await ssm.getParametersByPath(params).promise();

    mergedData.Parameters.push(...(Parameters || []));

    if (!NextToken) {
      break;
    }

    params.NextToken = NextToken;
  }

  return mergedData
}
