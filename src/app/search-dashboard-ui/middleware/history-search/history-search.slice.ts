import {
  createSelector,
  createSlice,
  type Action,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type {
  HistorySearchResult,
  HistorySearchState,
} from './history-search.model';
import type { RootState } from '../store';

export const HISTORY_SEARCH_FEATURE_KEY = 'history-search';

export const initialHistortSearchState: HistorySearchState = {
  query: '',
  searchId: '',
  searchState: '',
  searchResults: [],
};

export const historySearchSlice = createSlice({
  name: HISTORY_SEARCH_FEATURE_KEY,
  initialState: initialHistortSearchState,
  reducers: {
    setQuery(
      state: HistorySearchState,
      action: PayloadAction<{ query: string }>,
    ) {
      return {
        ...state,
        query: action.payload.query,
      };
    },

    setSearchId(
      state: HistorySearchState,
      action: PayloadAction<{ searchId: string }>,
    ) {
      return {
        ...state,
        SearchId: action.payload.searchId,
      };
    },

    setSearchState(
      state: HistorySearchState,
      action: PayloadAction<{ searchState: string }>,
    ) {
      return {
        ...state,
        searchState: action.payload.searchState,
      };
    },

    setSearchResults(
      state: HistorySearchState,
      action: PayloadAction<{
        searchResults: Array<HistorySearchResult>;
      }>,
    ) {
      return {
        ...state,
        searchResults: action.payload.searchResults,
      };
    },

    addSearchResults(
      state: HistorySearchState,
      action: PayloadAction<{
        searchResult: HistorySearchResult;
      }>,
    ) {
      const searchResult = action.payload.searchResult;
      return {
        ...state,
        searchResults: [...state.searchResults, searchResult],
      };
    },

    resetSearchResults(state: HistorySearchState, action: Action) {
      console.log('reset');
      return {
        ...state,
        searchResults: [],
      };
    },
  },
});

export const historySearchSliceActions = historySearchSlice.actions;
export const historySearchSliceReducer = historySearchSlice.reducer;

export const getHistorySearchState = (rootState: RootState) =>
  rootState[HISTORY_SEARCH_FEATURE_KEY];

/* Selectors */
export const historySearchSliceSelectors = {
  getSearchResults: createSelector(
    getHistorySearchState,
    (state) => state.searchResults,
  ),
  getSearchState: createSelector(
    getHistorySearchState,
    (state) => state.searchState,
  ),
};
