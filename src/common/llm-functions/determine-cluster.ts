import type { WebPageCluster } from './model';
import { checkAvailability, createPromptSession } from './utils';

const clusterSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      themes: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      description: {
        type: 'string',
      },
    },
  },
};

export default async function determineThematicClustering(
  themes: Array<string>,
): Promise<Array<WebPageCluster>> {
  if (!checkAvailability()) {
    console.error('Unable to extract themes from the content');
  }

  const uniqueThemes = themes.reduce((acc, theme) => {
    return acc.includes(theme) ? acc : [...acc, theme];
  }, [] as Array<string>);

  const session = await createPromptSession();
  const clusteringPrompt = `Here is a list of themes extracted from multiple documents:
      ${JSON.stringify(uniqueThemes)}

    Group these themes into coherent thematic clusters.
    Each cluster should have:
    1. A cluster name (3-5 words)
    2. Member themes (list)
    3. One-sentence cluster description
    `;

  const result = await session.prompt(clusteringPrompt, {
    responseConstraint: clusterSchema,
  });

  const parsedResult = JSON.parse(result);
  console.log('Clusters', parsedResult);

  return parsedResult;
}
