/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';

import App from './App';
import preload from './preload';
import routes from '@generated/routes'; // eslint-disable-line

// Client-side render (e.g: running in browser) to become single-page application (SPA).
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  preload(routes, window.location.pathname).then(() => {
    ReactDOM.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('app'),
    );
  });
}
