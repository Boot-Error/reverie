import { HistoryCollectionCardBoardWidget } from '../histoy-collection-card-board/history-collection-card-board';
import { HistorySearchBar } from '../history-search-bar/history-search-bar';
import { useSelector } from 'react-redux';
import { appSliceSelectors } from '../../middleware/app/app.slice';
import { HistorySearchResult } from '../history-search-result/history-search-result';

export interface HomePageProps {}

export function HomePage(props: HomePageProps) {
  const screen = useSelector(appSliceSelectors.getHomepageScreen);

  return (
    <div className="min-h-screen flex flex-col items-center py-16 px-6">
      {/* Title */}
      <h1 className="text-5xl font-bold  text-[#3a2f2a] mb-6 text-center">
        Browse what you have already browsed..
      </h1>
      <div className="mt-6 w-xl">
        <HistorySearchBar />
      </div>
      {screen === 'COLLECTION' && <HistoryCollectionCardBoardWidget />}
      {screen === 'SEARCH_RESULT' && <HistorySearchResult />}
    </div>
  );
}
