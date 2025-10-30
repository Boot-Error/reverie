import type { HistoryCollectionCard } from '../../../../common/history-collection-card/model';

export interface HistoryCollectionBoardState {
  clusters: Record<string, HistoryCollectionCard>;
}
