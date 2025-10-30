import { internetThemes } from '../constants/internet-cluster-themes';
import type { WebPageCluster } from './model';
import { checkAvailability, createPromptSession } from './utils';

const clusterThemeSchema = {
  type: 'object',
  properties: {
    theme: {
      type: 'string',
    },
    confidence: {
      type: 'string',
    },
  },
};

export default async function determineClusterTheme(
  clusterDetails: WebPageCluster,
): Promise<{ theme: string; confidence: string }> {
  if (!checkAvailability()) {
    console.error('Unable to extract themes from the content');
  }

  const session = await createPromptSession();
  const clusterThemePrompt = `Given the following list of themes common to webpages on internet:
      ${JSON.stringify(internetThemes)}


      And this cluster:
      "${JSON.stringify(clusterDetails)}

      Assign the cluster to the most related theme by reasoning on the coherence between the theme description and cluster description.
    `;

  const result = await session.prompt(clusterThemePrompt, {
    responseConstraint: clusterThemeSchema,
  });

  const parsedResult = JSON.parse(result);
  console.log('Cluster Theme', parsedResult);

  return parsedResult;
}
