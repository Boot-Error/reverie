import determineThematicClustering from '../../../common/llm-functions/determine-cluster';
import { TabContentDb } from '../../../common/datastore/tab-content-db';
import { ClusteredWebpagesDb } from '../../../common/datastore/clustered-webpages-db';
import findClusterForDocument from '../../../common/llm-functions/document-cluster-selection';
import {
  makeHistoryCollectionBoardChannel,
  type HistoryCollectionBoardMessagePayload,
} from '../../../common/messaging/history-collection-channel/history-collection-channel';
import { HistoryCollectionBoard } from '../../../common/history-collection-card/history-collection-card';
import determineClusterTheme from '../../../common/llm-functions/determine-cluster-theme';
import type { WebPageCluster } from '../../../common/llm-functions/model';
import type { MessagingChannel } from '../../../common/messaging/messaging';
import getClusterCaption from '../../../common/llm-functions/cluster-card-caption';

export class DashboardHandler {
  private static instance: DashboardHandler;

  private historyCollectionBoardChannel: MessagingChannel<HistoryCollectionBoardMessagePayload>;

  private constructor() {
    this.historyCollectionBoardChannel = makeHistoryCollectionBoardChannel();
  }

  public static getInstance(): DashboardHandler {
    if (!DashboardHandler.instance) {
      DashboardHandler.instance = new DashboardHandler();
    }
    return DashboardHandler.instance;
  }

  public async updateThematicClusters() {
    const themes = await TabContentDb.getInstance().getAllThemes();

    // generate new clusters
    const clusters = await determineThematicClustering(themes);

    const updatedClustersWithTheme = await Promise.all(
      clusters.map(async (clusterDetails: WebPageCluster) => {
        const clusterCollectionTheme =
          await determineClusterTheme(clusterDetails);

        const clusterCaption = await getClusterCaption(clusterDetails);
        return {
          ...clusterDetails,
          collectionTheme: clusterCollectionTheme.theme,
          cardCaption: clusterCaption.caption,
        };
      }),
    );
    await ClusteredWebpagesDb.getInstance().setClusters(
      updatedClustersWithTheme,
    );

    console.log('Clusters', clusters);

    const allTabs = await TabContentDb.getInstance().getAllTabs();

    await Promise.all(
      allTabs.map(async (url) => {
        const tabDetails =
          await TabContentDb.getInstance().getTabContentByUrl(url);
        if (tabDetails) {
          const clusterNames = (
            await ClusteredWebpagesDb.getInstance().getAllClusters()
          ).map((clusterDetails) => clusterDetails.name);
          const documentCluster = await findClusterForDocument(
            tabDetails.contentSummary,
            clusterNames,
          );

          await TabContentDb.getInstance().addClusterToDocument(
            tabDetails.url,
            documentCluster.assignedCluster,
          );
        }
      }),
    );

    this.publishBoardUpdates();
  }

  public async publishBoardUpdates(): Promise<void> {
    const historyCollectionBoard =
      await HistoryCollectionBoard.getInstance().getHistoryBoard();
    // FIXME: sometimes it returns undefined, find the root cause of it
    if (HistoryCollectionBoard) {
      await this.historyCollectionBoardChannel.send(
        {},
        {
          clusters: historyCollectionBoard,
        },
      );
    }
  }
}
