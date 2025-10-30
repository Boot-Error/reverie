import { configureStore } from '@reduxjs/toolkit';
import { all } from '@redux-saga/core/effects';
import createSagaMiddleware from '@redux-saga/core';
import { APP_FEATURE_KEY, appSliceReducer } from './app/app.slice';
import {
  HISTORY_COLLECTION_BOARD_FEATURE_KEY,
  historyCollectionBoardSliceReducer,
} from './history-collection-board/history-collection-board.slice';
import { historyCollectionBoardSagaWatchers } from './history-collection-board/history-collection-board.saga';
import {
  HISTORY_SEARCH_FEATURE_KEY,
  historySearchSliceReducer,
} from './history-search/history-search.slice';
import { historySearchSagaWatchers } from './history-search/history-search.saga';

export type RootState = ReturnType<typeof store.getState>;

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    [APP_FEATURE_KEY]: appSliceReducer,
    [HISTORY_COLLECTION_BOARD_FEATURE_KEY]: historyCollectionBoardSliceReducer,
    [HISTORY_SEARCH_FEATURE_KEY]: historySearchSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
  devTools: true,
});

function* rootSaga() {
  yield all([
    ...historyCollectionBoardSagaWatchers,
    ...historySearchSagaWatchers,
  ]);
}

sagaMiddleware.run(rootSaga);

export default function getStore() {
  return store;
}
