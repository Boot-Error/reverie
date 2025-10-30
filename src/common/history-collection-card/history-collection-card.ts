import { internetThemes } from '../constants/internet-cluster-themes';
import {
  ClusteredWebpagesDb,
  type ClusterDetails,
} from '../datastore/clustered-webpages-db';
import {
  TabContentDb,
  type TabContentProcessedDetails,
} from '../datastore/tab-content-db';
import type { CardTheme, HistoryCollectionCard } from './model';

export class HistoryCollectionBoard {
  private static instance: HistoryCollectionBoard;

  private constructor() {}

  public static getInstance(): HistoryCollectionBoard {
    if (!HistoryCollectionBoard.instance) {
      HistoryCollectionBoard.instance = new HistoryCollectionBoard();
    }
    return HistoryCollectionBoard.instance;
  }

  public async getHistoryBoard(): Promise<
    Record<string, HistoryCollectionCard>
  > {
    const clusters = await ClusteredWebpagesDb.getInstance().getAllClusters();

    const historyCollectionCards = await Promise.all(
      clusters.map(async (cluster) => {
        const tabs = await TabContentDb.getInstance().getAllTabsOfCluster(
          cluster.name,
        );

        console.log('History card', { clusters, tabs });
        if (tabs.length > 0) {
          const historyCollectionCard = await this.getHistoryCollectionCard(
            cluster,
            tabs,
          );
          return { clusterName: cluster.name, historyCollectionCard };
        }
      }),
    );
    const board = historyCollectionCards
      .filter((t) => t !== undefined)
      .reduce((acc, { clusterName, historyCollectionCard }) => {
        return { ...acc, [clusterName]: historyCollectionCard };
      }, {});

    return board;
  }

  private async getHistoryCollectionCard(
    cluster: ClusterDetails,
    webPageDetails: Array<TabContentProcessedDetails>,
  ): Promise<HistoryCollectionCard> {
    const collectionThemeDetails =
      internetThemes.find(
        (themeDetails) => themeDetails.theme === cluster.collectionTheme,
      ) || internetThemes[0];

    const cardTheme: CardTheme = {
      themeIcon: collectionThemeDetails.icon,
      size: 'M',
      primaryColor: collectionThemeDetails.colors.primary,
      accentColor: collectionThemeDetails.colors.accent,
      textColor: collectionThemeDetails.colors.textOnAccent,
    };

    const cardTitle = cluster?.cardCaption || cluster.name;

    // FIXME: populate this properly
    return {
      cardTitle: cardTitle,
      cardDescription: cluster.description,
      theme: cardTheme,
      webPageDetails: webPageDetails.map(({ url }) => ({
        domain: new URL(url).hostname,
        favicon: '',
        theme: {
          id: '',
          name: '',
          description: '',
        },
        navigateUrl: url,
      })),
    };
  }
}
