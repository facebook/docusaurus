/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {hydrate, render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import App from './App';
import preload from './preload';
import docusaurus from './docusaurus';
import routes from '@generated/routes'; // eslint-disable-line

// Client-side render (e.g: running in browser) to become single-page application (SPA).
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.docusaurus = docusaurus;
  // For production, attempt to hydrate existing markup for performant first-load experience.
  // For development, there is no existing markup so we had to render it.
  // Note that we also preload async component to avoid first-load loading screen.
  const renderMethod = process.env.NODE_ENV === 'production' ? hydrate : render;
  preload(routes, window.location.pathname).then(() => {
    renderMethod(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('__docusaurus'),
    );
  });

  // Webpack Hot Module Replacement API
  if (module.hot) {
    // Self-accepting method/ trick
    // (https://github.com/webpack/webpack-dev-server/issues/100#issuecomment-290911036)
    module.hot.accept();
  }
}
