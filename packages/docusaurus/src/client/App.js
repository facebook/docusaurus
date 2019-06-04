/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {renderRoutes} from 'react-router-config';

import routes from '@generated/routes';
import siteConfig from '@generated/docusaurus.config';

import Head from '@docusaurus/Head';
import DocusaurusContext from '@docusaurus/context';
import PendingNavigation from './PendingNavigation';

import '@generated/client-modules';

function App() {
  return (
    <DocusaurusContext.Provider value={{siteConfig}}>
      {/* TODO: this link stylesheet to infima is temporary */}
      <Head>
        <link
          href="https://infima-dev.netlify.com/css/default/default.min.css"
          preload
          rel="stylesheet"
          type="text/css"
        />
      </Head>
      <PendingNavigation routes={routes}>
        {renderRoutes(routes)}
      </PendingNavigation>
    </DocusaurusContext.Provider>
  );
}

export default App;
