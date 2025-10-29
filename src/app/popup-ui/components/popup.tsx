import React, { useState } from 'react';

export function Popup() {
  function handleOpenSearchDashbooard() {
    chrome.tabs.create({
      url: chrome.runtime.getURL('search-dashboard.html'),
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-[320px] bg-white text-gray-800 p-6 space-y-4 shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-indigo-600">Reverie</h1>
      <p className="text-center text-sm text-gray-600">
        Explore your browsing memories and rediscover your moments of curiosity.
      </p>
      <button
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-all duration-200 shadow-md"
        onClick={handleOpenSearchDashbooard}
      >
        Open Reverie
      </button>
    </div>
  );
}
