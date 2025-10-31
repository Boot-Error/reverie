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

export interface CardTheme {
  themeIcon: string;
  size: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
}

export interface HistoryCollectionCard {
  clusterName: string;
  cardTitle: string;
  cardDescription: string;
  theme: CardTheme;
  webPageDetails: Array<WebPageDetails>;
}
