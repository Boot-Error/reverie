import MiniSearch from 'minisearch';
import { v4 as uuidv4 } from 'uuid';

export class HistoryFullTextSearch {
  private static instance: HistoryFullTextSearch;
  private miniSearch: MiniSearch<{ id: string; url: string; summary: string }>;
  private documents: Map<string, { id: string; url: string; summary: string }> =
    new Map();

  private constructor() {
    this.miniSearch = new MiniSearch({
      fields: ['summary'], // Fields to index for full-text search
      storeFields: ['url', 'summary'], // Fields to return with search results
      searchOptions: {
        prefix: true, // Match partial words
        fuzzy: 0.2, // Allow minor typos
      },
    });
  }

  public static getInstance(): HistoryFullTextSearch {
    if (!HistoryFullTextSearch.instance) {
      HistoryFullTextSearch.instance = new HistoryFullTextSearch();
    }
    return HistoryFullTextSearch.instance;
  }

  /** Adds a document to the index */
  public async addDocument(url: string, summary: string) {
    const id = uuidv4();
    const doc = { id, url, summary };
    this.documents.set(id, doc);
    this.miniSearch.add(doc);
    console.log(this.miniSearch.documentCount);
  }

  /** Searches indexed documents using full-text search */
  public async searchDocument(query: string) {
    console.log({ query });
    const results = this.miniSearch.search(query, {
      combineWith: 'OR',
      boost: { summary: 2 },
    });

    console.log(this.miniSearch.termCount, results);

    // Format results for easier consumption
    return results.map((r) => ({
      url: r.url,
      summary: r.summary,
      score: r.score,
    }));
  }
}
