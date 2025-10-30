export interface TabContentProcessedDetails {
  url: string;
  contentSummary: string;
  contentThemes: Array<string>;
}

// export class TabContentDb {
//   private static instance: TabContentDb;

//   // private db: IDBDatabase;

//   private tabContentProcessed: Map<string, TabContentProcessedDetails> =
//     new Map();

//   private tabCluster: Map<string, string> = new Map();

//   private constructor() {
//     // (async () => {
//     //   await this.setupDb();
//     // })();
//   }

//   public static getInstance(): TabContentDb {
//     if (!TabContentDb.instance) {
//       TabContentDb.instance = new TabContentDb();
//     }
//     return TabContentDb.instance;
//   }

//   public async addTabContent(tabContentDetails: TabContentProcessedDetails) {
//     const url = tabContentDetails.url;
//     this.tabContentProcessed.set(url, tabContentDetails);
//     // const db = await this.getDb();
//     // const transaction = db.transaction('tab-content-processed', 'readwrite');
//     // const row = transaction.objectStore('tab-content-processed');
//     // const request = row.add(tabContentDetails);
//     // request.onsuccess = async () => {
//     //   console.log('tab added');
//     // };
//     // request.onerror = async () => {
//     //   console.error('Error adding tab', request.error);
//     // };
//   }

//   public addClusterToDocument(url: string, cluster: string) {
//     this.tabCluster.set(url, cluster);
//     chrome.storage.local.set()
//   }

//   public hasCluster(url: string) {
//     return this.tabCluster.has(url);
//   }

//   public getAllThemes(): Array<string> {
//     return Array.from(this.tabContentProcessed.values())
//       .map((row: TabContentProcessedDetails) => row.contentThemes)
//       .reduce((acc, themes) => {
//         return [...acc, ...themes.filter((theme) => !acc.includes(theme))];
//       }, []);
//   }

//   public getAllTabs() {
//     return Array.from(this.tabContentProcessed.keys());
//   }

//   public getAllTabsOfCluster(
//     clusterName: string,
//   ): Array<TabContentProcessedDetails> {
//     return Array.from(this.tabCluster.keys())
//       .filter((url) => this.tabCluster.get(url) === clusterName)
//       .map((url) => this.tabContentProcessed.get(url))
//       .filter((t) => t !== undefined);
//   }

//   public getTabContentByUrl(
//     url: string,
//   ): TabContentProcessedDetails | undefined {
//     return this.tabContentProcessed.get(url);
//   }
// }

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
    return stored.hasOwnProperty(url);
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
}
