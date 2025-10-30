import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { HistoryCollectionBoardState } from './history-collection-board.model';
import type { HistoryCollectionCard } from '../../../../common/history-collection-card/model';
import { _ as lo } from 'lodash';

import type { RootState } from '../store';

export const HISTORY_COLLECTION_BOARD_FEATURE_KEY = 'history-collection-board';

export const initialHistortCollectionBoardState: HistoryCollectionBoardState = {
  clusters: {},
};

export const historyCollectionBoardSlice = createSlice({
  name: HISTORY_COLLECTION_BOARD_FEATURE_KEY,
  initialState: initialHistortCollectionBoardState,
  reducers: {
    setBoard(
      state: HistoryCollectionBoardState,
      action: PayloadAction<{
        clusters: Record<string, HistoryCollectionCard>;
      }>,
    ) {
      return {
        ...state,
        clusters: action.payload.clusters,
      };
    },
  },
});

export const historyCollectionBoardSliceActions =
  historyCollectionBoardSlice.actions;
export const historyCollectionBoardSliceReducer =
  historyCollectionBoardSlice.reducer;

export const getHistoryCollectionBoardState = (rootState: RootState) =>
  rootState[HISTORY_COLLECTION_BOARD_FEATURE_KEY];

/* Selectors */
export const historyCollectionBoardSliceSelectors = {
  getBoard: createSelector(
    getHistoryCollectionBoardState,
    (state) => state.clusters,
  ),
};
