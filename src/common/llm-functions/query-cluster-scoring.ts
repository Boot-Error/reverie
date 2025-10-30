import type { ClusterDetails } from '../datastore/clustered-webpages-db';
import { checkAvailability, createPromptSession } from './utils';

const clusterQueryScoringSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      clusterName: {
        type: 'string',
      },
      score: {
        type: 'number',
      },
    },
  },
};

export default async function scoreQueryWithClusters(
  query: string,
  clusters: Array<ClusterDetails>,
): Promise<Array<{ clusterName: string; score: number }>> {
  if (!checkAvailability()) {
    console.error('Unable to extract themes from the content');
  }

  const session = await createPromptSession();

  const clusterAndDescription = clusters.map(({ name, description }) =>
    JSON.stringify({
      clusterName: name,
      clusterDescription: description,
    }),
  );

  const queryClusterScorePrompt = `From the list of clusters:

    ${clusterAndDescription}

    And this search query:
    ${query}

    Score each of the cluster between 1 to 10 based on how close the content will be in that cluster`;

  const result = await session.prompt(queryClusterScorePrompt, {
    responseConstraint: clusterQueryScoringSchema,
  });

  const parsedResult = JSON.parse(result);

  console.log('score', parsedResult);

  return parsedResult;
}
