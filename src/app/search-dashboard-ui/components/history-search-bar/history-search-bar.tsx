import { useEffect, useState, useSyncExternalStore } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { historySearchSagaActions } from '../../middleware/history-search/history-search.saga';
import { historyCollectionBoardSliceSelectors } from '../../middleware/history-collection-board/history-collection-board.slice';
import { historySearchSliceSelectors } from '../../middleware/history-search/history-search.slice';
import { appSlice, appSliceActions } from '../../middleware/app/app.slice';

// export function HistorySearchBar() {
//   const dispatch = useDispatch();
//   const [searchQuery, setSearchQuery] = useState('');

//   const handleSearchQuery = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleSearchSubmit = () => {
//     console.log('start search', searchQuery);
//     if (searchQuery && searchQuery.length > 0) {
//       dispatch(historySearchSagaActions.searchHistory({ query: searchQuery }));
//     }
//   };

//   return (
//     <div className="w-full max-w-xl mb-12 flex items-center">
//       <input
//         type="text"
//         placeholder="Describe the thing you are looking for.."
//         className="w-full px-6 py-3 rounded-l-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
//         onChange={handleSearchQuery}
//       />
//       <button
//         className="px-6 py-3 bg-blue-500 text-white font-medium rounded-r-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
//         onClick={handleSearchSubmit}
//       >
//         Search
//       </button>
//     </div>
//   );
// }

export function HistorySearchBar() {
  const dispatch = useDispatch();

  const searchState = useSelector(historySearchSliceSelectors.getSearchState);

  const [searchQuery, setSearchQuery] = useState('');
  const [isBreathing, setIsBreathing] = useState(false); // 🔥 NEW: toggle glow breathing
  const [showBrowseCategories, setShowBrowseCategories] = useState(false);

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    console.log('start search', searchQuery);
    if (searchQuery && searchQuery.length > 0) {
      dispatch(historySearchSagaActions.searchHistory({ query: searchQuery }));
      setIsBreathing(true);
      setShowBrowseCategories(true);
    }
  };

  useEffect(() => {
    if (searchState === 'SEARCH_END' || searchState === 'SEARCH_FAILED') {
      setIsBreathing(false);
    }
  }, [searchState]);

  const handleBrowseButton = () => {
    dispatch(appSliceActions.setHomepageScreen({ screen: 'COLLECTION' }));
    setShowBrowseCategories(false);
    setSearchQuery('');
  };

  return (
    // <div className="w-full max-w-xl mb-12 flex flex-col items-center gap-4">
    //   <div className="w-full flex items-center">
    //     {showBrowseCategories && (
    //       <button
    //         className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-md"
    //         onClick={handleSearchSubmit}
    //       >
    //         Back
    //       </button>
    //     )}
    //     <input
    //       type="text"
    //       placeholder="Describe the thing you are looking for.."
    //       className={`
    //         w-full px-6 py-3 rounded-l-full border border-transparent shadow-lg text-lg
    //         focus:outline-none bg-white transition-all duration-500
    //         ${isBreathing ? 'animate-[breathing_3s_ease-in-out_infinite]' : ''}
    //         [box-shadow:0_0_15px_2px_rgba(223,207,196,0.6),0_0_30px_10px_rgba(208,191,180,0.3)]
    //       `}
    //       onChange={handleSearchQuery}
    //       value={searchQuery}
    //     />
    //     {/*<button
    //       className="px-6 py-3 bg-blue-500 text-white font-medium rounded-r-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
    //       onClick={handleSearchSubmit}
    //     >
    //       Search
    //     </button>
    //     */}
    //     <button
    //       className="px-6 py-3
    //                  bg-gradient-to-r from-[rgba(177,160,149,1)] via-[rgba(192,174,163,1)] to-[rgba(223,207,196,1)]
    //                  text-white font-medium rounded-r-full
    //                  hover:from-[rgba(192,174,163,1)] hover:to-[rgba(223,207,196,1)]
    //                  focus:outline-none focus:ring-2 focus:ring-[rgba(177,160,149,0.6)]
    //                  text-lg transition-all duration-300 shadow-md hover:shadow-lg"
    //       onClick={handleSearchSubmit}
    //     >
    //       Search
    //     </button>
    //   </div>

    //   {/* 💡 Embedded breathing keyframes */}
    //   <style>{`

    //     @keyframes breathing {
    //       0% {
    //         box-shadow: 0 0 15px 2px rgba(223, 207, 196, 0.6),
    //                     0 0 30px 10px rgba(208, 191, 180, 0.3);
    //       }
    //       50% {
    //         box-shadow: 0 0 25px 4px rgba(192, 174, 163, 0.7),
    //                     0 0 40px 15px rgba(177, 160, 149, 0.4);
    //       }
    //       100% {
    //         box-shadow: 0 0 15px 2px rgba(223, 207, 196, 0.6),
    //                     0 0 30px 10px rgba(208, 191, 180, 0.3);
    //       }
    //     }

    //   `}</style>
    // </div>

    <div className="w-full max-w-xl mb-12 flex flex-col items-center gap-4">
      <div className="w-full flex items-center">
        {showBrowseCategories && (
          <button
            className="h-[54px] px-6 py-3
                       bg-[#b1a095] text-white font-medium rounded-l-full rounded-r-full
                       hover:bg-[#c0aea3]
                       focus:outline-none focus:ring-2 focus:ring-[#b1a095]
                       mr-5
                       text-lg transition-all duration-300 shadow-md hover:shadow-lg flex-shrink-0"
            onClick={handleBrowseButton}
          >
            <BaselineApps />
          </button>
        )}

        <input
          type="text"
          placeholder="Describe the thing you are looking for.."
          className={`
            w-full px-6 py-3 rounded-l-full border border-transparent shadow-lg text-lg
            focus:outline-none bg-[#f6f2ef] text-[#3a2f2a] placeholder-[#776a63]
            transition-all duration-500
            ${isBreathing ? 'animate-[breathing_3s_ease-in-out_infinite]' : ''}
            [box-shadow:0_0_15px_2px_rgba(223,207,196,0.6),0_0_30px_10px_rgba(208,191,180,0.3)]
          `}
          onChange={handleSearchQuery}
          value={searchQuery}
        />

        <button
          className="px-6 py-3
                     bg-[#b1a095] text-white font-medium rounded-r-full
                     hover:bg-[#c0aea3]
                     focus:outline-none focus:ring-2 focus:ring-[#b1a095]
                     text-lg transition-all duration-300 shadow-md hover:shadow-lg"
          onClick={handleSearchSubmit}
        >
          Search
        </button>
      </div>
      <style>{`

        @keyframes breathing {
          0% {
            box-shadow: 0 0 15px 2px rgba(223, 207, 196, 0.6),
                        0 0 30px 10px rgba(208, 191, 180, 0.3);
          }
          50% {
            box-shadow: 0 0 25px 4px rgba(192, 174, 163, 0.7),
                        0 0 40px 15px rgba(177, 160, 149, 0.4);
          }
          100% {
            box-shadow: 0 0 15px 2px rgba(223, 207, 196, 0.6),
                        0 0 30px 10px rgba(208, 191, 180, 0.3);
          }
        }

      `}</style>
    </div>
  );
}

export function BaselineApps(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M4 8h4V4H4zm6 12h4v-4h-4zm-6 0h4v-4H4zm0-6h4v-4H4zm6 0h4v-4h-4zm6-10v4h4V4zm-6 4h4V4h-4zm6 6h4v-4h-4zm0 6h4v-4h-4z"
      ></path>
    </svg>
  );
}
