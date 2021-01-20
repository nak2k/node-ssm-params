import { describeAllParameters } from './describeAllParameters';

export async function queryParameterNamesWithPrefix(prefix: string) {
  const data = await describeAllParameters({
    ParameterFilters: [
      {
        Key: 'Name',
        Option: 'BeginsWith',
        Values: [prefix],
      },
    ],
  });

  return data.Parameters.map(({ Name }) => Name!);
}
