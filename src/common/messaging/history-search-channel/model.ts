export interface BaseHistorySearchResultEvent {
  searchId: string;
}

export interface HistorySearchResultStartEvent
  extends BaseHistorySearchResultEvent {
  eventType: 'SEARCH_START';
}

export interface HistorySearchResultEndEvent
  extends BaseHistorySearchResultEvent {
  eventType: 'SEARCH_END';
}

export interface HistorySearchResultFailedEvent
  extends BaseHistorySearchResultEvent {
  eventType: 'SEARCH_FAILED';
}

export interface HistorySearchClusterSearchResultEvent
  extends BaseHistorySearchResultEvent {
  eventType: 'SEARCH_CLUSTER_RESULT';
  scoringCluster: string;
  // clusters: Record<string, { score: number }>;
}

export interface HistorySearchWebPageResultEvent
  extends BaseHistorySearchResultEvent {
  eventType: 'SEARCH_WEBPAGE_RESULT';
  navigateUrl: string;
  contentSummary: string;
  relevanceScore: number;
  highlightText: string;
}

export type HistorySearchResultEvent =
  | HistorySearchResultStartEvent
  | HistorySearchResultEndEvent
  | HistorySearchResultFailedEvent
  | HistorySearchClusterSearchResultEvent
  | HistorySearchWebPageResultEvent;

export interface HistorySearchQueryEvent {
  searchId: string;
  query: string;
}
