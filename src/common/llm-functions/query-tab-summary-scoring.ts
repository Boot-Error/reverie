import { checkAvailability, createPromptSession } from './utils';

const tabSummaryQueryScoringSchema = {
  type: 'object',
  properties: {
    score: {
      type: 'number',
    },
    highlightText: {
      type: 'string',
    },
  },
};

export default async function scoreQueryWithTabSummary(
  query: string,
  tabContentSummary: string,
): Promise<{ score: number; highlightText: string }> {
  if (!checkAvailability()) {
    console.error('Unable to extract themes from the content');
  }

  const querySummaryScoringPrompt = `You will act as an expert information retrieval and semantic matching system. Your task is to evaluate how relevant a given summary is to a search query. Analyze the meaning, not just keyword overlap, to produce a detailed and reasoned response.

  For each input pair (summary, search query):

  1. Provide a relevance score between 0 and 1, where:
    0 = completely irrelevant
    0.5 = partially related or tangentially relevant
    1 = highly relevant and directly addressing the query

  2. Identify and return the most relevant part of the summary text that best supports the match.

  Ensure your assessment accounts for semantic similarity, contextual meaning, and intent alignment between the query and the summary.

  The Search Query: ${query}
  The Content Summary: ${tabContentSummary}
  `;

  const session = await createPromptSession();
  const result = await session.prompt(querySummaryScoringPrompt, {
    responseConstraint: tabSummaryQueryScoringSchema,
  });

  const parsedResult = JSON.parse(result);

  console.log('summary score', parsedResult);

  return parsedResult;
}
