import { makeTabSummarizationChannel } from '../../../common/messaging/tab-summarization-channel/tab-summarization-channel';
import { ChromeExtensionConnector } from '../connectors/chrome-extension-connector';
import { TabContentDb } from '../../../common/datastore/tab-content-db';
import { DashboardHandler } from './dashboard-handler';
import { ClusteredWebpagesDb } from '../../../common/datastore/clustered-webpages-db';
import { findNonSerializableValue } from '@reduxjs/toolkit';
import findClusterForDocument from '../../../common/llm-functions/document-cluster-selection';

export class TabContentHandler {
  private static instance: TabContentHandler;

  private lowRankingTabsCapturedTotal: number;

  private constructor() {
    this.lowRankingTabsCapturedTotal = 0;
  }

  public static getInstance(): TabContentHandler {
    if (!TabContentHandler.instance) {
      TabContentHandler.instance = new TabContentHandler();
    }
    return TabContentHandler.instance;
  }

  public async startTabContentReader(): Promise<void> {
    // setup listener to capture tab navigation
    //
    console.log('Starting tab content reader');

    console.log('Start Tab content script injector');
    await ChromeExtensionConnector.getInstance().onTabNavigate(
      async (tabDetails) => {
        const tabId = tabDetails.tabId;
        const url = tabDetails.url;

        if (!url) {
          return;
        }

        /**
         * Check and process if the tab is seen first time
         */
        const tabAlreadyProcessed =
          await TabContentDb.getInstance().getTabContentByUrl(url);

        if (
          ![
            url.startsWith('chrome://'),
            url.startsWith('chrome-extension://'),
          ].some(Boolean) &&
          !tabAlreadyProcessed
        ) {
          console.log('Executing grabber on tab', tabId);
          await ChromeExtensionConnector.getInstance().injectScriptToTab(
            'static/js/tab-content-grabber.js',
            tabId,
          );
        }
      },
    );

    const tabSummarizationMessageChannel = makeTabSummarizationChannel();

    console.log('Start Tab content capture channel');
    await tabSummarizationMessageChannel.subscribe(
      {},
      async (context, payload) => {
        console.log('Received content', payload);
        await TabContentDb.getInstance().addTabContent({
          ...payload,
        });

        const clusterNames = (
          await ClusteredWebpagesDb.getInstance().getAllClusters()
        ).map((clusterDetails) => clusterDetails.name);

        /**
         * Find an existing cluster, if not found then buffer it for processing
         */
        if (clusterNames.length > 2) {
          console.log('finding cluster');
          const documentCluster = await findClusterForDocument(
            payload.contentSummary,
            clusterNames,
          );

          console.log({ documentCluster });
          if (documentCluster.confidence > 0.9) {
            await TabContentDb.getInstance().addClusterToDocument(
              payload.url,
              documentCluster.assignedCluster,
            );
            await DashboardHandler.getInstance().publishBoardUpdates();
          } else {
            console.log('Low ranking document, not added to a cluster');
            this.lowRankingTabsCapturedTotal += 1;
          }
        } else {
          // since no clusters, there is nothing to rank with
          this.lowRankingTabsCapturedTotal += 1;
        }

        await this.bufferedClustering();
      },
    );
    // process unprocessed tabs
    console.log('Check for unprocessed tabs');
    const unprocessedTabs = await TabContentDb.getInstance().unprocessedTabs();
    console.log(unprocessedTabs, unprocessedTabs.length);
    if (unprocessedTabs.length > 5) {
      console.log('Processing unprocessed tab with thematic update', {
        tabs: unprocessedTabs.length,
      });
      await DashboardHandler.getInstance().updateThematicClusters();
    }
  }

  private async bufferedClustering() {
    if (this.lowRankingTabsCapturedTotal > 3) {
      console.log('Starting thematic clustering updated');
      this.lowRankingTabsCapturedTotal = 0;
      await DashboardHandler.getInstance().updateThematicClusters();
    }
  }
}
