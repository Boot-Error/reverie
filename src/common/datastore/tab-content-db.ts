export interface TabContentProcessedDetails {
  url: string;
  contentSummary: string;
  contentThemes: Array<string>;
}

export class TabContentDb {
  private static instance: TabContentDb;

  private constructor() {}

  public static getInstance(): TabContentDb {
    if (!TabContentDb.instance) {
      TabContentDb.instance = new TabContentDb();
    }
    return TabContentDb.instance;
  }

  /** Helper to get data from chrome.storage.local */
  private async getFromStorage<T>(key: string): Promise<T | undefined> {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    });
  }

  /** Helper to set data in chrome.storage.local */
  private async setInStorage<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => resolve());
    });
  }

  /** Add or update tab content details */
  public async addTabContent(tabContentDetails: TabContentProcessedDetails) {
    const url = tabContentDetails.url;

    const stored =
      (await this.getFromStorage<Record<string, TabContentProcessedDetails>>(
        'tabContentProcessed',
      )) || {};

    stored[url] = tabContentDetails;

    await this.setInStorage('tabContentProcessed', stored);
  }

  /** Add or update cluster mapping for a URL */
  public async addClusterToDocument(url: string, cluster: string) {
    const stored =
      (await this.getFromStorage<Record<string, string>>('tabCluster')) || {};
    stored[url] = cluster;
    await this.setInStorage('tabCluster', stored);
  }

  /** Check if a cluster exists for a given URL */
  public async hasCluster(url: string): Promise<boolean> {
    const stored =
      (await this.getFromStorage<Record<string, string>>('tabCluster')) || {};
    return url in stored;
  }

  /** Get all unique content themes */
  public async getAllThemes(): Promise<Array<string>> {
    const stored =
      (await this.getFromStorage<Record<string, TabContentProcessedDetails>>(
        'tabContentProcessed',
      )) || {};

    const allThemes = Object.values(stored)
      .map((row) => row.contentThemes)
      .flat();

    // Deduplicate
    return Array.from(new Set(allThemes));
  }

  /** Get all stored tab URLs */
  public async getAllTabs(): Promise<Array<string>> {
    const stored =
      (await this.getFromStorage<Record<string, TabContentProcessedDetails>>(
        'tabContentProcessed',
      )) || {};
    return Object.keys(stored);
  }

  /** Get all tab contents belonging to a specific cluster */
  public async getAllTabsOfCluster(
    clusterName: string,
  ): Promise<Array<TabContentProcessedDetails>> {
    const tabCluster =
      (await this.getFromStorage<Record<string, string>>('tabCluster')) || {};
    const tabContentProcessed =
      (await this.getFromStorage<Record<string, TabContentProcessedDetails>>(
        'tabContentProcessed',
      )) || {};

    return Object.keys(tabCluster)
      .filter((url) => tabCluster[url] === clusterName)
      .map((url) => tabContentProcessed[url])
      .filter((t): t is TabContentProcessedDetails => !!t);
  }

  /** Get tab content by URL */
  public async getTabContentByUrl(
    url: string,
  ): Promise<TabContentProcessedDetails | undefined> {
    const stored =
      (await this.getFromStorage<Record<string, TabContentProcessedDetails>>(
        'tabContentProcessed',
      )) || {};
    return stored[url];
  }

  public async unprocessedTabs(): Promise<Array<string>> {
    const tabs = await this.getAllTabs();
    const stored =
      (await this.getFromStorage<Record<string, string>>('tabCluster')) || {};

    const unclusteredTabs = tabs.filter(
      (url) => !Object.keys(stored).includes(url),
    );

    console.log(
      'unprocess',
      tabs,
      stored,
      unclusteredTabs,
      Object.keys(stored),
    );
    return unclusteredTabs;
  }
}
