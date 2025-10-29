import { ChromeMessagingPipe } from '../../../common/messaging/messaging';
import { ChromeExtensionConnector } from '../connectors/chrome-extension-connector';

export class HistoryCollector {
  private static instance: HistoryCollector;

  private constructor() {}

  public static getInstance(): HistoryCollector {
    if (!HistoryCollector.instance) {
      HistoryCollector.instance = new HistoryCollector();
    }
    return HistoryCollector.instance;
  }

  /**
   * Pulls history and syncs for semantic search
   */
  public async syncHistory(): Promise<void> {
    const pipe = ChromeMessagingPipe.new<{ url: string }>({ name: 'test' });
    const urls = await ChromeExtensionConnector.getInstance().getAllHistory();
    // setInterval(() => {
    //   urls.forEach((url) => {
    //     // pipe.publish({ url });
    //     console.log(url);
    //   });
    // }, 2 * 1000);
  }

  public async collectHistory(): Promise<void> {
    await ChromeExtensionConnector.getInstance().onHistoryUpdate(
      async ({ url }) => {
        console.log('visited ', url);
      },
    );
  }
}
