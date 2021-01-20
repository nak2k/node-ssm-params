import { SSM } from 'aws-sdk';

export async function describeAllParameters(params: SSM.DescribeParametersRequest) {
  const ssm = new SSM();

  const mergedData = { Parameters: [] as SSM.ParameterMetadataList };

  for (; ;) {
    const { Parameters, NextToken } = await ssm.describeParameters(params).promise();

    mergedData.Parameters.push(...(Parameters || []));

    if (!NextToken) {
      break;
    }

    params.NextToken = NextToken;
  }

  return mergedData;
}
