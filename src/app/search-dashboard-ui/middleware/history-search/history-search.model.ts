export interface HistorySearchResult {
  navigateUrl: string;
  contentSummary: string;
  score: number;
  highlightText: string;
}

export interface HistorySearchState {
  searchState: string;
  searchId: string;
  query: string;
  searchResults: Array<HistorySearchResult>;
}
