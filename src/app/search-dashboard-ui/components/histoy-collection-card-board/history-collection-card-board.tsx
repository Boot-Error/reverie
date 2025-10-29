import { HistoryCollectionCardWidget } from '../history-collection-card/history-collection-card';
import { historyCards } from './constants';

export interface HistoryCollectionCardBoardProps {}

export function HistoryCollectionCardBoardWidget(
  props: HistoryCollectionCardBoard,
) {
  const cards = historyCards.map((card) => (
    <HistoryCollectionCardWidget cardDetails={card} />
  ));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
      {cards}
    </div>
  );
}
