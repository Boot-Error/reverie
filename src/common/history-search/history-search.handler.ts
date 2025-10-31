import { ClusteredWebpagesDb } from '../datastore/clustered-webpages-db';
import { TabContentDb } from '../datastore/tab-content-db';
import scoreQueryWithClusters from '../llm-functions/query-cluster-scoring';
import scoreQueryWithTabSummary from '../llm-functions/query-tab-summary-scoring';
import {
  makeHistorySearchQueryChannel,
  makeHistorySearchResultChannel,
} from '../messaging/history-search-channel/history-search-channel';
import type { HistorySearchResultEvent } from '../messaging/history-search-channel/model';
import type { MessagingChannel } from '../messaging/messaging';

export class HistorySearchHandler {
  private static instance: HistorySearchHandler;
  private historySearchResultEventChannel: MessagingChannel<HistorySearchResultEvent>;

  private constructor() {
    this.historySearchResultEventChannel = makeHistorySearchResultChannel();
  }

  public static getInstance(): HistorySearchHandler {
    if (!HistorySearchHandler.instance) {
      HistorySearchHandler.instance = new HistorySearchHandler();
    }
    return HistorySearchHandler.instance;
  }

  public async setupHistorySearchQueryListener() {
    const historySearchQueryEventChannel = makeHistorySearchQueryChannel();
    await historySearchQueryEventChannel.subscribe(
      {},
      async (context, message) => {
        const searchQuery = message.query;
        const searchId = message.searchId;
        console.log('Got search Request', message);
        await this.searchInHistory(searchId, searchQuery);
      },
    );
  }

  public async searchInHistory(searchId: string, query: string) {
    // match query with most relevant cluster
    const allClusters =
      await ClusteredWebpagesDb.getInstance().getAllClusters();

    this.historySearchResultEventChannel.send(
      {},
      {
        eventType: 'SEARCH_START',
        searchId,
      },
    );

    // const queryClusterScores = await scoreQueryWithClusters(query, allClusters);

    // const scoringCluster = queryClusterScores.reduce(
    //   (acc, current) => {
    //     return current.score >= acc.score ? current : acc;
    //   },
    //   { clusterName: '', score: 0 },
    // );

    // this.historySearchResultEventChannel.send(
    //   {},
    //   {
    //     eventType: 'SEARCH_CLUSTER_RESULT',
    //     searchId,
    //     scoringCluster: scoringCluster.clusterName,
    //   },
    // );

    const webPages = await TabContentDb.getInstance().getAllTabs();

    await Promise.all(
      webPages.map(async (url) => {
        const tab = await TabContentDb.getInstance().getTabContentByUrl(url);
        if (!tab) return;
        const result = await scoreQueryWithTabSummary(
          query,
          tab.contentSummary,
        );
        this.historySearchResultEventChannel.send(
          {},
          {
            eventType: 'SEARCH_WEBPAGE_RESULT',
            searchId,
            navigateUrl: tab.url,
            contentSummary: tab.contentSummary,
            relevanceScore: result.score,
            highlightText: result.highlightText,
          },
        );
      }),
    );
  }
}
