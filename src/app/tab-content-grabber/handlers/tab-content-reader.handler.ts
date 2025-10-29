import * as TextVersion from 'textversionjs';
import { makeTabSummarizationChannel } from '../../../common/messaging/tab-summarization-channel/tab-summarization-channel';

export class TabContentReaderHandler {
  private static instance: TabContentReaderHandler;
  private constructor() {}

  public static getInstance() {
    if (!TabContentReaderHandler.instance) {
      TabContentReaderHandler.instance = new TabContentReaderHandler();
    }
    return TabContentReaderHandler.instance;
  }

  public async captureAndPublishReadableContent(): Promise<void> {
    try {
      const url = window.location.href;
      console.log({ url });

      const bodyInnerText = document.getElementsByTagName('body')[0].innerText;
      const contentText = TextVersion(bodyInnerText);

      console.log(contentText);

      const contentSummary = await this.summarizeText(contentText);
      const contentThemes = await this.extractThemes(contentText);

      const tabSummarizationChannel = makeTabSummarizationChannel();
      await tabSummarizationChannel.send(
        {},
        {
          url: window.location.href,
          contentSummary: contentSummary.contentSummary,
          contentThemes: contentThemes.themes,
        },
      );
    } catch (err: unknown) {
      console.error(err, err?.stackTrace);
    }
  }

  private async summarizeText(
    content: string,
  ): Promise<{ contentSummary: string }> {
    const availability = await Summarizer.availability();
    if (availability !== 'available') {
      console.error('Unable to summarize content due to ', availability);
    }

    const options: SummarizerCreateOptions = {
      sharedContext: 'This is a scientific article',
      type: 'key-points',
      format: 'markdown',
      length: 'medium',
      outputLanguage: 'en',
      expectedInputLanguages: ['en'],
      expectedContextLanguages: ['en'],
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Downloaded ${e.loaded * 100}%`);
        });
      },
    };

    const summarizer = await Summarizer.create(options);
    const response = await summarizer.summarize(content, {
      context: 'This is an extracted text of a website',
    });
    console.log({ response });

    return {
      contentSummary: response,
    };
  }

  private async extractThemes(
    content: string,
  ): Promise<{ themes: Array<string> }> {
    const availability = await LanguageModel.availability();
    if (availability !== 'available') {
      console.error(
        'Unable to extract themes from the content due to ',
        availability,
      );
    }

    const themeSchema = {
      type: 'object',
      properties: {
        themes: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    };

    const session = await LanguageModel.create({
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Downloaded ${e.loaded * 100}%`);
        });
      },
    });

    const themeExtractionPrompt = `You are an expert in content analysis.
    Read the following text and return 2 to 4 high-level themes capturing the main ideas.
    `;

    const result = await session.prompt(
      `${themeExtractionPrompt} \n\n${content}`,
      {
        responseConstraint: themeSchema,
      },
    );

    console.log('Themes', result);
    const parsedResponse = JSON.parse(result);

    return {
      themes: parsedResponse.themes,
    };
  }
}
