import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { historySearchSagaActions } from '../../middleware/history-search/history-search.saga';

export function HistorySearchBar() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    console.log('start search', searchQuery);
    if (searchQuery && searchQuery.length > 0) {
      dispatch(historySearchSagaActions.searchHistory({ query: searchQuery }));
    }
  };

  return (
    <div className="w-full max-w-xl mb-12 flex items-center">
      <input
        type="text"
        placeholder="Describe the thing you are looking for.."
        className="w-full px-6 py-3 rounded-l-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        onChange={handleSearchQuery}
      />
      <button
        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-r-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        onClick={handleSearchSubmit}
      >
        Search
      </button>
    </div>
  );
}
