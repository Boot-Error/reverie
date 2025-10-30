import { HistoryCollectionCardBoardWidget } from '../histoy-collection-card-board/history-collection-card-board';
import { HistorySearchBar } from '../history-search-bar/history-search-bar';
import { useSelector } from 'react-redux';
import { appSliceSelectors } from '../../middleware/app/app.slice';
import { HistorySearchResult } from '../history-search-result/history-search-result';

export interface HomePageProps {}

export function HomePage(props: HomePageProps) {
  const screen = useSelector(appSliceSelectors.getHomepageScreen);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-6">
      {/* Title */}
      <h1 className="text-5xl font-bold text-gray-800 mb-6 text-center">
        Browse what you have already browsed..
      </h1>
      <HistorySearchBar />
      {screen === 'COLLECTION' && <HistoryCollectionCardBoardWidget />}
      {screen === 'SEARCH_RESULT' && <HistorySearchResult />}
    </div>
  );
}
