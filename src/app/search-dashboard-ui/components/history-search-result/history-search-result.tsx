import { useSelector } from 'react-redux';
import { historySearchSliceSelectors } from '../../middleware/history-search/history-search.slice';
import { HistorySearchResultRow } from '../history-search-result-row/history-search-result-row';
import { useEffect, useState } from 'react';

export function HistorySearchResult() {
  const [showResults, setShowResults] = useState(false);
  const searchResults = useSelector(
    historySearchSliceSelectors.getSearchResults,
  );
  const filteredSearchResults = searchResults.filter(
    (result) => result.score > 0.6,
  );
  let searchResultsScored = filteredSearchResults;
  if (searchResultsScored.length > 1)
    searchResultsScored = filteredSearchResults.toSorted(
      (resultA, resultB) => resultB.score - resultA.score,
    );
  const searchState = useSelector(historySearchSliceSelectors.getSearchState);
  useEffect(() => {
    if (searchState === 'SEARCH_WEBPAGE_RESULT') {
      setShowResults(true);
    }
  }, [searchState]);
  return (
    <div className=" flex flex-col items-center">
      {searchState === 'SEARCH_START' && (
        <p className="text-4xl font-semibold relative inline-block shine-text mt-20">
          Searching in the history
        </p>
      )}
      {searchState === 'SEARCH_WEBPAGE_RESULT' && (
        <p className="text-2xl font-semibold relative inline-block shine-text self-center">
          Collecting tabs for you
        </p>
      )}
      {searchState === 'SEARCH_END' && filteredSearchResults.length == 0 && (
        <p className="text-3xl font-semibold relative inline-block self-center no-shine-text mt-20">
          Found nothing related to the query
        </p>
      )}
      {showResults && (
        <div className="w-full max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-lg overflow-scroll">
          {searchResultsScored.map((r, i) => (
            <HistorySearchResultRow key={i} searchResult={r} />
          ))}
        </div>
      )}
    </div>
  );
}
