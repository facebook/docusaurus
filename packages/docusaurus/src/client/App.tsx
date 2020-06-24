/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState} from 'react';

import routes from '@generated/routes';
import siteConfig from '@generated/docusaurus.config';
import globalData from '@generated/globalData.json';
import renderRoutes from './exports/renderRoutes';
import DocusaurusContext from './exports/context';
import PendingNavigation from './PendingNavigation';

import './client-lifecycles-dispatcher';

function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <DocusaurusContext.Provider value={{siteConfig, isClient, globalData}}>
      <PendingNavigation routes={routes}>
        {renderRoutes(routes)}
      </PendingNavigation>
    </DocusaurusContext.Provider>
  );
}

export default App;
