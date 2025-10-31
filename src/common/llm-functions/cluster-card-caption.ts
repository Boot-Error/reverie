import type { WebPageCluster } from './model';
import { checkAvailability, createPromptSession } from './utils';

const clusterCaptionSchema = {
  type: 'object',
  properties: {
    caption: {
      type: 'string',
    },
  },
};

export default async function getClusterCaption(
  clusterDetails: WebPageCluster,
): Promise<{ caption: string }> {
  if (!checkAvailability()) {
    console.error('Unable to extract themes from the content');
  }

  const session = await createPromptSession();

  const clusterCaptionPrompt = `
    From the following text:
    "${clusterDetails.description}"

    Translate the text to caption which is catchy to capture user's attention. make it short of 10-12 words max
    `;

  const result = await session.prompt(clusterCaptionPrompt, {
    responseConstraint: clusterCaptionSchema,
  });

  const parsedResult = JSON.parse(result);

  return parsedResult;
}
