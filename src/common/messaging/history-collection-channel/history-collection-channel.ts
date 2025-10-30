import type { HistoryCollectionCard } from '../../history-collection-card/model';
import { newMessageChannel, type MessagingChannel } from '../messaging';

export interface HistoryCollectionBoardMessagePayload {
  clusters: Record<string, HistoryCollectionCard>;
}

export function makeHistoryCollectionBoardChannel(): MessagingChannel<HistoryCollectionBoardMessagePayload> {
  return newMessageChannel<HistoryCollectionBoardMessagePayload>(
    'HISTORY_COLLECTION_CARD',
  );
}
