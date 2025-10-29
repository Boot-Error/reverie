import { configureStore } from '@reduxjs/toolkit';
import { all } from '@redux-saga/core/effects';
import createSagaMiddleware from '@redux-saga/core';
import { APP_FEATURE_KEY, appSliceReducer } from './app/app.slice';

export type RootState = ReturnType<typeof store.getState>;

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    [APP_FEATURE_KEY]: appSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
  devTools: true,
});

function* rootSaga() {
  yield all([]);
}

sagaMiddleware.run(rootSaga);

export default function getStore() {
  return store;
}
