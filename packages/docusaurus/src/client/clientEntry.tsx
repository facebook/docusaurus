/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM, {type ErrorInfo} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';

import ExecutionEnvironment from './exports/ExecutionEnvironment';
import App from './App';
import preload from './preload';
import docusaurus from './docusaurus';

declare global {
  interface NodeModule {
    hot?: {accept: () => void};
  }
}

const hydrate = Boolean(process.env.HYDRATE_CLIENT_ENTRY);

// Client-side render (e.g: running in browser) to become single-page
// application (SPA).
if (ExecutionEnvironment.canUseDOM) {
  window.docusaurus = docusaurus;
  const container = document.getElementById('__docusaurus')!;

  const app = (
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  );

  const onRecoverableError = (error: unknown, errorInfo: ErrorInfo): void => {
    console.error(
      'Docusaurus React Root onRecoverableError:',
      error,
      errorInfo,
    );
  };

  const renderApp = () => {
    if (hydrate) {
      React.startTransition(() => {
        ReactDOM.hydrateRoot(container, app, {
          onRecoverableError,
        });
      });
    } else {
      const root = ReactDOM.createRoot(container, {onRecoverableError});
      React.startTransition(() => {
        root.render(app);
      });
    }
  };

  preload(window.location.pathname).then(renderApp);

  // Webpack Hot Module Replacement API
  if (module.hot) {
    // Self-accepting method/ trick
    // (https://github.com/webpack/webpack-dev-server/issues/100#issuecomment-290911036)
    module.hot.accept();
  }
}
