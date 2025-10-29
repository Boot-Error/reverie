export interface WebPageTheme {
  id: string;
  name: string;
  description: string;
}

export interface WebPageDetails {
  domain: string;
  favicon: string;
  theme: WebPageTheme;
  navigateUrl: string;
}

export interface HistoryCollectionCard {
  cardTitle: string;
  cardDescription: string;
  themeIcon: string;
  webPageDetails: Array<WebPageDetails>;
}
