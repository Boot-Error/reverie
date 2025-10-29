export class ChromeAIHandler {
  private static instance: ChromeAIHandler;
  private constructor() {}
  public static getInstance(): ChromeAIHandler {
    if (!ChromeAIHandler.instance) {
      ChromeAIHandler.instance = new ChromeAIHandler();
    }
    return ChromeAIHandler.instance;
  }

  /**
   * Setup the Web Machine Learning
   */
  public async setupAI() {
    const availability = await LanguageModel.availability();

    switch (availability) {
      case 'available':
        console.log('Language Model is available');
        break;
      case 'unavailable':
        console.log('Language Model is not available');
        break;
      case 'downloadable':
        console.log('Setting things up');
        break;
      case 'downloading':
        console.log('Downloading the model');
        break;
      default:
        break;
    }
  }
}
