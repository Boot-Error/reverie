import { TabContentReaderHandler } from './handlers/tab-content-reader.handler';

/**
 * This script is injected to each tab to grab textual information for the summarization and processing
 */
console.log('🚀 Content script injected!');

document.body.style.outline = '2px solid limegreen'; // example action

(async () => {
  console.log('Extension is loaded');
  await TabContentReaderHandler.getInstance().captureAndPublishReadableContent();
})();
