import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';
import getStore from './middleware/store';
import { Popup } from './components/popup';

const container = document.getElementById('root');
if (container) {
  const store = getStore();
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <Provider store={store}>
        <Popup />
      </Provider>
    </StrictMode>,
  );
}
