import type {
  HistoryCollectionCard,
  WebPageDetails,
  WebPageTheme,
} from '../../../../common/history-collection-card/model';

const themes: Array<WebPageTheme> = [
  {
    id: 't1',
    name: 'Light',
    description: 'Light color scheme with soft backgrounds',
  },
  {
    id: 't2',
    name: 'Dark',
    description: 'Dark color scheme with high contrast',
  },
  {
    id: 't3',
    name: 'Nature',
    description: 'Green and earthy tones for nature websites',
  },
  { id: 't4', name: 'Tech', description: 'Modern technology-themed style' },
  { id: 't5', name: 'Minimal', description: 'Minimalist and clean layout' },
];

const webPages: Array<WebPageDetails> = [
  {
    domain: 'example.com',
    favicon: 'https://example.com/favicon.ico',
    theme: themes[0],
    navigateUrl: 'https://example.com/home',
  },
  {
    domain: 'darksite.org',
    favicon: 'https://darksite.org/favicon.ico',
    theme: themes[1],
    navigateUrl: 'https://darksite.org/dashboard',
  },
  {
    domain: 'natureblog.net',
    favicon: 'https://natureblog.net/favicon.ico',
    theme: themes[2],
    navigateUrl: 'https://natureblog.net/posts',
  },
  {
    domain: 'techupdates.io',
    favicon: 'https://techupdates.io/favicon.ico',
    theme: themes[3],
    navigateUrl: 'https://techupdates.io/latest',
  },
  {
    domain: 'minimaldesign.com',
    favicon: 'https://minimaldesign.com/favicon.ico',
    theme: themes[4],
    navigateUrl: 'https://minimaldesign.com/gallery',
  },
];

export const historyCards: Array<HistoryCollectionCard> = [
  {
    cardTitle: 'Work Tools',
    cardDescription: 'Frequently used productivity and work websites',
    themeIcon: '💻',
    webPageDetails: [webPages[0], webPages[1]],
  },
  {
    cardTitle: 'Personal Blogs',
    cardDescription: 'Blogs and personal projects I follow',
    themeIcon: '✍️',
    webPageDetails: [webPages[2], webPages[4]],
  },
  {
    cardTitle: 'Tech News',
    cardDescription: 'Latest technology updates and articles',
    themeIcon: '📰',
    webPageDetails: [webPages[3]],
  },
  {
    cardTitle: 'Mixed Collection',
    cardDescription: 'A mix of different websites for testing',
    themeIcon: '🧩',
    webPageDetails: [webPages[0], webPages[2], webPages[3], webPages[4]],
  },
];
