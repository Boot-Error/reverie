import { useDispatch, useSelector } from 'react-redux';
import { HistoryCollectionCardWidget } from '../history-collection-card/history-collection-card';
import { historyCards } from './constants';
import { useEffect } from 'react';
import { historyCollectionBoardSagaActions } from '../../middleware/history-collection-board/history-collection-board.saga';
import { historyCollectionBoardSliceSelectors } from '../../middleware/history-collection-board/history-collection-board.slice';

export interface HistoryCollectionCardBoardProps {}

export function HistoryCollectionCardBoardWidget(
  props: HistoryCollectionCardBoard,
) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(historyCollectionBoardSagaActions.initiateBoardStateUpdate());
  }, []);

  const historyCardsByCluster = useSelector(
    historyCollectionBoardSliceSelectors.getBoard,
  );

  console.log({ historyCardsByCluster });

  const cards = Object.entries(historyCardsByCluster).map(([cluster, card]) => (
    <HistoryCollectionCardWidget cardDetails={card} />
  ));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
      {cards}
    </div>
  );
}
