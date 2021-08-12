/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import routes from '@generated/routes';
import renderRoutes from './exports/renderRoutes';
import {ClientContextProvider} from './exports/clientContext';
import {DocusaurusContextProvider} from './exports/docusaurusContext';
import PendingNavigation from './PendingNavigation';
import BaseUrlIssueBanner from './baseUrlIssueBanner/BaseUrlIssueBanner';
import Root from '@theme/Root';

import './client-lifecycles-dispatcher';

function App(): JSX.Element {
  return (
    <DocusaurusContextProvider>
      <ClientContextProvider>
        <Root>
          <BaseUrlIssueBanner />
          <PendingNavigation routes={routes}>
            {renderRoutes(routes)}
          </PendingNavigation>
        </Root>
      </ClientContextProvider>
    </DocusaurusContextProvider>
  );
}

export default App;
