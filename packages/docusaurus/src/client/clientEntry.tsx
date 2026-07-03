/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {startTransition} from 'react';
import ReactDOM, {type ErrorInfo} from 'react-dom/client';
import {HelmetProvider} from 'react-helmet-async';
import {createBrowserHistory, createHashHistory} from 'history';
import siteConfig from '@generated/docusaurus.config';
import ExecutionEnvironment from './exports/ExecutionEnvironment';
import {DocusaurusRouter} from './exports/router';
import App from './App';
import preload from './preload';
import docusaurus from './docusaurus';

const hydrate = Boolean(process.env.HYDRATE_CLIENT_ENTRY);

// Client-side render (e.g: running in browser) to become single-page
// application (SPA).
if (ExecutionEnvironment.canUseDOM) {
  window.docusaurus = docusaurus;
  const container = document.getElementById('__docusaurus')!;

  // React Router v6+ no longer exposes a mutable history object, so Docusaurus
  // creates its own (from the `history` package) and drives React Router with it
  // through <DocusaurusRouter>. This powers useHistory() (blocking, listening,
  // querystring updates).
  const history =
    siteConfig.future.experimental_router === 'hash'
      ? createHashHistory()
      : createBrowserHistory();

  const app = (
    <HelmetProvider>
      <DocusaurusRouter history={history}>
        <App />
      </DocusaurusRouter>
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
    if (window.docusaurusRoot) {
      window.docusaurusRoot.render(app);
      return;
    }
    if (hydrate) {
      window.docusaurusRoot = ReactDOM.hydrateRoot(container, app, {
        onRecoverableError,
      });
    } else {
      const root = ReactDOM.createRoot(container, {onRecoverableError});
      root.render(app);
      window.docusaurusRoot = root;
    }
  };

  preload(window.location.pathname).then(() => {
    startTransition(renderApp);
  });

  // Webpack Hot Module Replacement API
  if (module.hot) {
    // Self-accepting method/ trick
    // (https://github.com/webpack/webpack-dev-server/issues/100#issuecomment-290911036)
    module.hot.accept();
  }
}
