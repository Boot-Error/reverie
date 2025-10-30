import { createAction } from '@reduxjs/toolkit';
import { _ as lo } from 'lodash';
import {
  HISTORY_COLLECTION_BOARD_FEATURE_KEY,
  historyCollectionBoardSliceActions,
  historyCollectionBoardSliceSelectors,
} from './history-collection-board.slice';
import {
  call,
  fork,
  put,
  select,
  take,
  takeLatest,
  type AllEffect,
  type ForkEffect,
} from '@redux-saga/core/effects';
import { eventChannel, type EventChannel } from '@redux-saga/core';
import {
  makeHistoryCollectionBoardChannel,
  type HistoryCollectionBoardMessagePayload,
} from '../../../../common/messaging/history-collection-channel/history-collection-channel';
import type { HistoryCollectionCard } from '../../../../common/history-collection-card/model';
import type { PayloadAction } from '@reduxjs/toolkit';
import { HistoryCollectionBoard } from '../../../../common/history-collection-card/history-collection-card';

export const historyCollectionBoardSagaActions = {
  initiateBoardStateUpdate: createAction(
    `${HISTORY_COLLECTION_BOARD_FEATURE_KEY}/initiateBoardStateUpdate`,
  ),
  openCollectionInTabGroup: createAction<{ collectionCard: string }>(
    `${HISTORY_COLLECTION_BOARD_FEATURE_KEY}/openCollectionInTabGroup`,
  ),
};

export const historyCollectionBoardSagaWatchers = [
  takeLatest(
    historyCollectionBoardSagaActions.initiateBoardStateUpdate.type,
    initiateBoardStateUpdate,
  ),
  takeLatest(
    historyCollectionBoardSagaActions.openCollectionInTabGroup.type,
    initiateOpenCollectionInTabGroup,
  ),
];

function* initiateBoardStateUpdate() {
  yield fork(watchHistoryCollectionBoardEvents);
  yield fork(loadHistoryCollectionCardsFromStorage);
}

function* initiateOpenCollectionInTabGroup(
  action: PayloadAction<{ collectionCard: string }>,
) {
  yield fork(openAllWebPagesInTabGroup, action.payload.collectionCard);
}

function* loadHistoryCollectionCardsFromStorage() {
  const clusters: Record<string, HistoryCollectionCard> = yield call(
    async () => {
      return await HistoryCollectionBoard.getInstance().getHistoryBoard();
    },
  );
  console.log('Clusters from extension storage', clusters);
  yield put(historyCollectionBoardSliceActions.setBoard({ clusters }));
}

function* openAllWebPagesInTabGroup(collectionCard: string) {
  const cardDetails: HistoryCollectionCard | undefined = yield call(
    getCardDetailsByCluster,
    collectionCard,
  );
  if (cardDetails) {
    cardDetails.webPageDetails.map(({ navigateUrl }) => {
      chrome.tabs.create({
        url: navigateUrl,
      });
    });
  }
}

function* getCardDetailsByCluster(cluster: string) {
  const clusters: Record<string, HistoryCollectionCard> = yield select(
    historyCollectionBoardSliceSelectors.getBoard,
  );
  return lo.get(clusters, [cluster]);
}

function createHistoryCollectionBoardChannel(): EventChannel<HistoryCollectionBoardMessagePayload> {
  return eventChannel<HistoryCollectionBoardMessagePayload>((emit) => {
    const historyCollectionBoardChannel = makeHistoryCollectionBoardChannel();
    historyCollectionBoardChannel.subscribe(
      {},
      async (context, messagePayload: HistoryCollectionBoardMessagePayload) => {
        emit(messagePayload);
      },
    );

    return () => {
      historyCollectionBoardChannel.unsubscribe();
    };
  });
}

function* watchHistoryCollectionBoardEvents() {
  const historyCollectionBoardChannel: EventChannel<HistoryCollectionBoardMessagePayload> =
    yield call(createHistoryCollectionBoardChannel);

  while (true) {
    const event: HistoryCollectionBoardMessagePayload = yield take(
      historyCollectionBoardChannel,
    );
    console.log({ event });
    yield put(
      historyCollectionBoardSliceActions.setBoard({ clusters: event.clusters }),
    );
  }
}
