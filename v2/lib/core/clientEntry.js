import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';

import App from './App';
import prerender from './prerender';
import routes from '@generated/routes'; // eslint-disable-line

// Client side render (e.g: running in browser) to become single-page application (SPA)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  prerender(routes, window.location.pathname).then(() => {
    ReactDOM.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('app')
    );
  });
}
