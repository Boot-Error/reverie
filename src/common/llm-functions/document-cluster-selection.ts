import { checkAvailability, createPromptSession } from './utils';

const clusterSchema = {
  type: 'object',
  properties: {
    assignedCluster: {
      type: 'string',
    },
    confidence: {
      type: 'number',
    },
  },
};

export default async function findClusterForDocument(
  contentSummary: string,
  clusters: Array<string>,
): Promise<{ assignedCluster: string; confidence: number }> {
  if (!checkAvailability()) {
    console.error('Unable to extract themes from the content');
  }

  const session = await createPromptSession();
  // const clustersAsPoints = clusters.reduce((acc, cluster, index) => {
  //   return `${acc}\n${index}. ${cluster}`;
  // }, '');
  const clusterDocumentMatchingPrompt = `Given the following thematic clusters:
    ${clusters}

  And this document:
  "${contentSummary}

  Assign the document to the most relevant thematic cluster by reasoning about the main topic.
`;
  const result = await session.prompt(clusterDocumentMatchingPrompt, {
    responseConstraint: clusterSchema,
  });

  console.log('Relevant cluster', result, contentSummary);

  const parsedResult = JSON.parse(result);

  return parsedResult;
}
