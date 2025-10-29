import { newMessageChannel, type MessagingChannel } from '../messaging';

export interface TabSummarizationMessagePayload {
  url: string;
  contentSummary: string;
  contentThemes: Array<string>;
}

export function makeTabSummarizationChannel(): MessagingChannel<TabSummarizationMessagePayload> {
  return newMessageChannel<TabSummarizationMessagePayload>('TAB_SUMMARIZATION');
}
