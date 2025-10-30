export interface ThematicSummarizedWebPageContent {
  tabId: string;
  url: string;
  contentSummary: string;
  contentThemes: Array<string>;
}

export interface WebPageCluster {
  name: string;
  description: string;
  themes: Array<string>;
}
