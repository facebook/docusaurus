/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';

import routes from '@generated/routes';
import ExecutionEnvironment from './exports/ExecutionEnvironment';
import App from './App';
import preload from './preload';
import docusaurus from './docusaurus';

import {isReactRoot} from './isReactRoot';

declare global {
  interface NodeModule {
    hot?: {accept: () => void};
  }
}

// Client-side render (e.g: running in browser) to become single-page
// application (SPA).
if (ExecutionEnvironment.canUseDOM) {
  window.docusaurus = docusaurus;
  // For production, attempt to hydrate existing markup for performant
  // first-load experience.
  // For development, there is no existing markup so we had to render it.
  // We also preload async component to avoid first-load loading screen.
  if (!isReactRoot()) {
    // for react <= 17
    const renderMethod =
      process.env.NODE_ENV === 'production'
        ? ReactDOM.hydrate
        : ReactDOM.render;
    preload(routes, window.location.pathname).then(() => {
      renderMethod(
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>,
        document.getElementById('__docusaurus'),
      );
    });
  } else {
    // for react >= 18
    const ReactDOMClient = require('react-dom/client');
    const appRoot = ReactDOMClient.createRoot(
      document.getElementById('__docusaurus'),
    );
    const appRootforHydrate = ReactDOMClient.hydrateRoot;
    const renderMethod = (app: React.ReactNode) =>
      process.env.NODE_ENV === 'production'
        ? appRootforHydrate(document.getElementById('__docusaurus'), app)
        : appRoot.render(app);
    preload(routes, window.location.pathname).then(() => {
      renderMethod(
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>,
      );
    });
  }

  // Webpack Hot Module Replacement API
  if (module.hot) {
    // Self-accepting method/ trick
    // (https://github.com/webpack/webpack-dev-server/issues/100#issuecomment-290911036)
    module.hot.accept();
  }
}
