/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Head from '@docusaurus/Head';
import routes from '@generated/routes';
import siteConfig from '@generated/docusaurus.config';
import renderRoutes from '@docusaurus/renderRoutes';
import DocusaurusContext from '@docusaurus/context';
import PendingNavigation from './PendingNavigation';

import './client-lifecycles-dispatcher';

function App() {
  const {stylesheets, scripts} = siteConfig;
  return (
    <DocusaurusContext.Provider value={{siteConfig}}>
      {(stylesheets || scripts) && (
        <Head>
          {stylesheets &&
            stylesheets.map(source =>
              source.href ? (
                <link rel="stylesheet" key={source.href} {...source} />
              ) : (
                <link rel="stylesheet" key={source} href={source} />
              ),
            )}
          {scripts &&
            scripts.map(source =>
              source.src ? (
                <script type="text/javascript" key={source.src} {...source} />
              ) : (
                <script type="text/javascript" src={source} key={source} />
              ),
            )}
        </Head>
      )}
      <PendingNavigation routes={routes}>
        {renderRoutes(routes)}
      </PendingNavigation>
    </DocusaurusContext.Provider>
  );
}

export default App;
