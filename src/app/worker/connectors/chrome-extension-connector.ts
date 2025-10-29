export class ChromeExtensionConnector {
  private static instance: ChromeExtensionConnector;
  private constructor() {}
  public static getInstance(): ChromeExtensionConnector {
    if (!ChromeExtensionConnector.instance) {
      ChromeExtensionConnector.instance = new ChromeExtensionConnector();
    }
    return ChromeExtensionConnector.instance;
  }

  public async getAllHistory(): Promise<Array<string>> {
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const oneWeekAgo = new Date().getTime() - millisecondsPerWeek;

    const historyItems = await new Promise<Array<chrome.history.HistoryItem>>(
      (resolve, reject) =>
        chrome.history.search(
          {
            text: '',
            startTime: oneWeekAgo,
          },
          (historyItems) => {
            resolve(historyItems);
          },
        ),
    );

    return historyItems
      .map((item) => item?.url)
      .filter((url) => url !== undefined);
  }

  public async onHistoryUpdate(
    callback: (item: { url: string }) => Promise<void>,
  ): Promise<void> {
    const visitListener = chrome.history.onVisited.addListener(
      async (historyItem: chrome.history.HistoryItem) => {
        if (historyItem?.url) {
          callback({ url: historyItem.url });
        }
      },
    );
  }

  public async injectScriptToTab(
    scriptPath: string,
    tabId: number,
  ): Promise<void> {
    try {
      const result = await chrome.scripting.executeScript({
        target: { tabId },
        files: [scriptPath],
      });
      console.log('Script Injection Result', result);
    } catch (err: unknown) {
      console.error('Failed to inject script', scriptPath, tabId, err);
    }
  }

  public async onTabNavigate(
    callback: (tabDetails: { tabId: number; url?: string }) => Promise<void>,
  ) {
    chrome.tabs.onCreated.addListener(async (tab) => {
      if (tab.id && tab.url) {
        await callback({ tabId: tab.id, url: tab.url });
      }
    });

    // Inject script when tab is updated (e.g., navigated or reloaded)
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab?.url) {
        await callback({ tabId, url: tab.url });
      }
    });
  }
}
