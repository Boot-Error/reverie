import { useSelector } from 'react-redux';
import { historySearchSliceSelectors } from '../../middleware/history-search/history-search.slice';
import { HistorySearchResultRow } from '../history-search-result-row/history-search-result-row';

export function HistorySearchResult() {
  const searchResults = useSelector(
    historySearchSliceSelectors.getSearchResults,
  );
  let searchResultsScored = searchResults;
  if (searchResultsScored.length > 1)
    searchResultsScored = searchResults.toSorted(
      (resultA, resultB) => resultB.score - resultA.score,
    );
  const searchState = useSelector(historySearchSliceSelectors.getSearchState);
  return (
    <div>
      {searchState === 'SEARCH_START' && <p>Searcing in history..</p>}
      {searchState === 'SEARCH_WEBPAGE_RESULT' && (
        <div className="w-full max-w-3xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
          {searchResultsScored.map((r, i) => (
            <HistorySearchResultRow key={i} searchResult={r} />
          ))}
        </div>
      )}
    </div>
  );
}
