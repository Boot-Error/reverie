export interface ClusterDetails {
  name: string;
  description: string;
  themes: Array<string>;
  collectionTheme: string;
  cardCaption: string;
}

// export class ClusteredWebpagesDb {
//   private static instance: ClusteredWebpagesDb;

//   private clusters: Map<string, ClusterDetails> = new Map();

//   private constructor() {}

//   public static getInstance(): ClusteredWebpagesDb {
//     if (!ClusteredWebpagesDb.instance) {
//       ClusteredWebpagesDb.instance = new ClusteredWebpagesDb();
//     }
//     return ClusteredWebpagesDb.instance;
//   }

//   public addCluster(clusterDetails: ClusterDetails) {
//     this.clusters.set(clusterDetails.name, clusterDetails);
//   }

//   public getAllClusters(): Array<ClusterDetails> {
//     return Array.from(this.clusters.values());
//   }
// }

export class ClusteredWebpagesDb {
  private static instance: ClusteredWebpagesDb;
  private static readonly STORAGE_KEY = 'clusters';

  private constructor() {}

  public static getInstance(): ClusteredWebpagesDb {
    if (!ClusteredWebpagesDb.instance) {
      ClusteredWebpagesDb.instance = new ClusteredWebpagesDb();
    }
    return ClusteredWebpagesDb.instance;
  }

  /**
   * Add or update a cluster in chrome.storage.local
   */
  public async addClusters(clusters: Array<ClusterDetails>): Promise<void> {
    const previousClusters = await this.getAllClustersAsMap();
    clusters.map((clusterDetails) =>
      previousClusters.set(clusterDetails.name, clusterDetails),
    );
    await this.saveClustersToStorage(previousClusters);
  }

  public async setClusters(clusters: Array<ClusterDetails>): Promise<void> {
    const previousClusters = new Map<string, ClusterDetails>();
    clusters.map((clusterDetails) =>
      previousClusters.set(clusterDetails.name, clusterDetails),
    );
    await this.saveClustersToStorage(previousClusters);
  }

  /**
   * Retrieve all clusters from chrome.storage.local
   */
  public async getAllClusters(): Promise<Array<ClusterDetails>> {
    const clusters = await this.getAllClustersAsMap();
    return Array.from(clusters.values());
  }

  /**
   * Internal: Retrieve all clusters as a Map
   */
  private async getAllClustersAsMap(): Promise<Map<string, ClusterDetails>> {
    return new Promise((resolve) => {
      chrome.storage.local.get([ClusteredWebpagesDb.STORAGE_KEY], (result) => {
        const stored = result[ClusteredWebpagesDb.STORAGE_KEY] || {};
        const map = new Map<string, ClusterDetails>(Object.entries(stored));
        resolve(map);
      });
    });
  }

  /**
   * Internal: Save clusters map back to chrome.storage.local
   */
  private async saveClustersToStorage(
    clusters: Map<string, ClusterDetails>,
  ): Promise<void> {
    return new Promise((resolve) => {
      const obj: Record<string, ClusterDetails> = Object.fromEntries(clusters);
      chrome.storage.local.set({ [ClusteredWebpagesDb.STORAGE_KEY]: obj }, () =>
        resolve(),
      );
    });
  }
}
