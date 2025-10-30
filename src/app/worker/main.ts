import { HistorySearchHandler } from '../../common/history-search/history-search.handler';
import { ChromeAIHandler } from './handlers/chrome-ai.handler';
import { HistoryCollector } from './handlers/history-collector.handler';
import { TabContentHandler } from './handlers/tab-content.handler';

console.log('background worker is starting up');

(async () => {
  // await ChromeAIHandler.getInstance().setupAI();
  // await HistoryCollector.getInstance().syncHistory();
  // await HistoryCollector.getInstance().collectHistory();
  await TabContentHandler.getInstance().startTabContentReader();
  await HistorySearchHandler.getInstance().setupHistorySearchQueryListener();
})();
