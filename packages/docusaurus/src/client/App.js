/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import routes from '@generated/routes';
import siteConfig from '@generated/docusaurus.config';
import renderRoutes from '@docusaurus/renderRoutes';
import DocusaurusContext from '@docusaurus/context';
import PendingNavigation from './PendingNavigation';

import './client-lifecycles-dispatcher';

function App() {
  return (
    <DocusaurusContext.Provider value={{siteConfig}}>
      <PendingNavigation routes={routes}>
        {renderRoutes(routes)}
      </PendingNavigation>
    </DocusaurusContext.Provider>
  );
}

export default App;
