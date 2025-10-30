import { newMessageChannel, type MessagingChannel } from '../messaging';
import type {
  HistorySearchQueryEvent,
  HistorySearchResultEvent,
} from './model';

export function makeHistorySearchQueryChannel(): MessagingChannel<HistorySearchQueryEvent> {
  return newMessageChannel<HistorySearchQueryEvent>('HISTORY_SEARCH_QUERY');
}

export function makeHistorySearchResultChannel(): MessagingChannel<HistorySearchResultEvent> {
  return newMessageChannel<HistorySearchResultEvent>('HISTORY_SEARCH_Result');
}
