import React from 'react';
import Loadable from 'react-loadable';
import {BrowserRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';

import App from './App';

// Client side render (e.g: running in browser) to become single-page application (SPA)
if (typeof document !== 'undefined') {
  Loadable.preloadReady().then(() => {
    ReactDOM.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('app'),
    );
  });
}
