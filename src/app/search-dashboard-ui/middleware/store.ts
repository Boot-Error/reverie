import { configureStore } from '@reduxjs/toolkit';
import { all } from '@redux-saga/core/effects';
import createSagaMiddleware from '@redux-saga/core';
import { APP_FEATURE_KEY, appSliceReducer } from './app/app.slice';
import {
  HISTORY_COLLECTION_BOARD_FEATURE_KEY,
  historyCollectionBoardSliceReducer,
} from './history-collection-board/history-collection-board.slice';
import { historyCollectionBoardSagaWatchers } from './history-collection-board/history-collection-board.saga';

export type RootState = ReturnType<typeof store.getState>;

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    [APP_FEATURE_KEY]: appSliceReducer,
    [HISTORY_COLLECTION_BOARD_FEATURE_KEY]: historyCollectionBoardSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
  devTools: true,
});

function* rootSaga() {
  yield all([...historyCollectionBoardSagaWatchers]);
}

sagaMiddleware.run(rootSaga);

export default function getStore() {
  return store;
}
