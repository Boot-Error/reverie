// import FlexSearch, { Document } from 'flexsearch';
// import * as MiniSearch from 'minisearch';

// export class HistoryFullTextSearch {
//   private static instance: HistoryFullTextSearch;

//   private minisearch: typeof MiniSearch;

//   private constructor() {
//     this.setupFlexSearch();
//   }

//   public static getInstance(): HistoryFullTextSearch {
//     if (!HistoryFullTextSearch.instance) {
//       HistoryFullTextSearch.instance = new HistoryFullTextSearch();
//     }
//     return HistoryFullTextSearch.instance;
//   }

//   public async searchDocument(query: string) {
//     const result = this.minisearch.search(query);
//     console.log({ result });
//     return result;
//   }

//   public async addDocument(url: string, summary: string) {
//     this.minisearch.addDocument({
//       url,
//       summary,
//     });
//   }

//   private setupFlexSearch() {
//     const minisearch = new MiniSearch({
//       fields: ['url', 'summary'],
//       storeFields: ['url', 'summary'],
//     });
//     this.index = minisearch;
//   }
// }
// import Fuse from 'fuse.js';

// export function test() {
//   const fuseOptions = {
//     // isCaseSensitive: false,
//     // includeScore: false,
//     // ignoreDiacritics: false,
//     // shouldSort: true,
//     // includeMatches: false,
//     // findAllMatches: false,
//     // minMatchCharLength: 1,
//     // location: 0,
//     // threshold: 0.6,
//     // distance: 100,
//     // useExtendedSearch: false,
//     // ignoreLocation: false,
//     // ignoreFieldNorm: false,
//     // fieldNormWeight: 1,
//     keys: ['title', 'author.firstName'],
//   };

//   const fuse = new Fuse([], fuseOptions);
// }
