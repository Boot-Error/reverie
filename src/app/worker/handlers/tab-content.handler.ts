import Dexie from 'dexie';
import { makeTabSummarizationChannel } from '../../../common/messaging/tab-summarization-channel/tab-summarization-channel';
import { ChromeExtensionConnector } from '../connectors/chrome-extension-connector';

export class TabContentHandler {
  private static instance: TabContentHandler;

  private constructor() {
    // this.setupTabContentDb();
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

    await ChromeExtensionConnector.getInstance().onTabNavigate(
      async (tabDetails) => {
        const tabId = tabDetails.tabId;
        const url = tabDetails.url;

        if (
          url &&
          ![
            url.startsWith('chrome://'),
            url.startsWith('chrome-extension://'),
          ].some(Boolean)
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
    await tabSummarizationMessageChannel.subscribe(
      {},
      async (context, payload) => {
        console.log('Received content', payload);
        // await this.tabContentDb.tabContent.add({
        //   url: payload.url,
        //   contentSummary: payload.contentSummary,
        // });
      },
    );
    // inject content reader script
  }
  // private setupTabContentDb() {
  //   if (!this.tabContentDb) {
  //     const db = new Dexie('reverie-tab-content');
  //     db.Version(1).stores({
  //       tabContent: '++id, url, contentSummary',
  //     });

  //     db.open().catch((err) => {
  //       console.error('Failed to open db', err);
  //     });

  //     this.tabContentDb = db;
  //   }
  // }
}
