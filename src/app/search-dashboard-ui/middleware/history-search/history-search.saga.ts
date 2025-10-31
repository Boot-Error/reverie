import { createAction, type PayloadAction } from '@reduxjs/toolkit';
import {
  HISTORY_SEARCH_FEATURE_KEY,
  historySearchSliceActions,
} from './history-search.slice';
import { call, fork, put, take, takeLatest } from '@redux-saga/core/effects';
import {
  makeHistorySearchQueryChannel,
  makeHistorySearchResultChannel,
} from '../../../../common/messaging/history-search-channel/history-search-channel';
import { eventChannel, type EventChannel } from '@redux-saga/core';
import type { HistorySearchResultEvent } from '../../../../common/messaging/history-search-channel/model';
import { appSliceActions } from '../app/app.slice';
import { historyCollectionBoardSliceActions } from '../history-collection-board/history-collection-board.slice';

export const historySearchSagaActions = {
  searchHistory: createAction<{ query: string }>(
    `${HISTORY_SEARCH_FEATURE_KEY}/searchHistory`,
  ),
};

export const historySearchSagaWatchers = [
  takeLatest(
    historySearchSagaActions.searchHistory.type,
    initiateHistorySearch,
  ),
];

function* initiateHistorySearch(action: PayloadAction<{ query: string }>) {
  yield fork(watchHistorySearchResultEvents);
  yield fork(sendHistorySearchQueryEvent, action.payload.query);
}

function* sendHistorySearchQueryEvent(query: string) {
  const searchId = Math.floor(10000 + Math.random() * 90000).toString();
  yield put(historySearchSliceActions.setSearchId({ searchId }));
  yield put(historySearchSliceActions.setQuery({ query }));
  yield put(appSliceActions.setHomepageScreen({ screen: 'SEARCH_RESULT' }));
  yield call(async (query: string) => {
    const historySearchQueryEventChannel = makeHistorySearchQueryChannel();
    await historySearchQueryEventChannel.send(
      {},
      {
        searchId,
        query,
      },
    );
  }, query);
}

function createHistorySearchResultEventChannel(): EventChannel<HistorySearchResultEvent> {
  return eventChannel<HistorySearchResultEvent>((emit) => {
    const historySearchResultEventChannel = makeHistorySearchResultChannel();
    historySearchResultEventChannel.subscribe(
      {},
      async (context, messagePayload: HistorySearchResultEvent) => {
        emit(messagePayload);
      },
    );
    return () => {
      historySearchResultEventChannel.unsubscribe();
    };
  });
}

function* watchHistorySearchResultEvents() {
  const historySearchResultEventChannel: EventChannel<HistorySearchResultEvent> =
    yield call(createHistorySearchResultEventChannel);

  while (true) {
    const event: HistorySearchResultEvent = yield take(
      historySearchResultEventChannel,
    );

    console.log({ event });

    const eventType = event.eventType;

    yield put(
      historySearchSliceActions.setSearchState({ searchState: eventType }),
    );

    switch (eventType) {
      case 'SEARCH_START':
        yield put(historySearchSliceActions.resetSearchResults);
        break;

      case 'SEARCH_CLUSTER_RESULT':
        break;

      case 'SEARCH_WEBPAGE_RESULT':
        yield put(
          historySearchSliceActions.addSearchResults({
            searchResult: {
              navigateUrl: event.navigateUrl,
              contentSummary: event.contentSummary || '',
              score: event.relevanceScore,
              highlightText: event.highlightText || '',
            },
          }),
        );
        break;

      case 'SEARCH_FAILED':
        break;

      case 'SEARCH_END':
        break;

      default:
        break;
    }

    // yield put(
    //   historySearchResultSliceActions.setBoard({ clusters: event.clusters }),
    // );
  }
}
