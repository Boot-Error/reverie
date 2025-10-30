import { useEffect } from 'react';
import { ChromeMessagingPipe } from '../../../../common/messaging/messaging';
import { HistoryCollectionCardBoardWidget } from '../histoy-collection-card-board/history-collection-card-board';

export interface HomePageProps {}

export function HomePage(props: HomePageProps) {
  useEffect(() => {}, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-6">
      {/* Title */}
      <h1 className="text-5xl font-bold text-gray-800 mb-6 text-center">
        Browse what you have already browsed..
      </h1>

      {/* Search Bar */}
      <div className="w-full max-w-xl mb-12">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-6 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </div>

      {/* Cards Grid */}
      <HistoryCollectionCardBoardWidget />
    </div>
  );
}
