import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { AppState } from './app.model';
import type { RootState } from '../store';

export const APP_FEATURE_KEY = 'app';

export const initialAppState: AppState = {
  page: 'HOME',
  screen: 'COLLECTION',
};

export const appSlice = createSlice({
  name: APP_FEATURE_KEY,
  initialState: initialAppState,
  reducers: {
    setPage(state: AppState, action: PayloadAction<string>) {
      return {
        ...state,
        page: action.payload,
      };
    },
    setHomepageScreen(
      state: AppState,
      action: PayloadAction<{ screen: 'COLLECTION' | 'SEARCH_RESULT' }>,
    ) {
      return {
        ...state,
        screen: action.payload.screen,
      };
    },
  },
});

export const appSliceActions = appSlice.actions;
export const appSliceReducer = appSlice.reducer;

export const getAppState = (rootState: RootState) => rootState[APP_FEATURE_KEY];

/* Selectors */
export const appSliceSelectors = {
  getCurrentPage: createSelector(getAppState, (state) => state.page),
  getHomepageScreen: createSelector(getAppState, (state) => state.screen),
};
