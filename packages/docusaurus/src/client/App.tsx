/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';

import routes from '@generated/routes';
import siteConfig from '@generated/docusaurus.config';
import globalData from '@generated/globalData';
import siteMetadata from '@generated/site-metadata';
import renderRoutes from './exports/renderRoutes';
import DocusaurusContext from './exports/context';
import Head from './exports/Head';
import PendingNavigation from './PendingNavigation';

import './client-lifecycles-dispatcher';
import './hideCSSLoadingWarning.css';

function CSSLoadingWarningMessage() {
  const {baseUrl} = siteConfig;
  const {pathname} = useLocation();

  if (pathname === baseUrl) {
    return (
      <>
        <Head
          script={[
            {
              type: 'text/javascript',
              innerHTML: `
              var baseUrlSuggestion = document.getElementById("css-didnt-load-baseurl-suggestion");
              if (baseUrlSuggestion) {
                baseUrlSuggestion.innerHTML = window.location.pathname;
              }
              `,
            },
          ]}
        />
        <div
          className="css-loading-warning"
          style={{border: 'solid red thick', padding: '16px'}}>
          <span>
            You site CSS did not load properly. Your baseUrl setting is probably
            bad.{' '}
          </span>
          <span>
            Maybe try baseUrl ={' '}
            <span id="css-didnt-load-baseurl-suggestion">
              {/* baseUrl suggestion message */}
            </span>
          </span>
        </div>
      </>
    );
  }
  return null;
}

function App(): JSX.Element {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <DocusaurusContext.Provider
      value={{siteConfig, siteMetadata, globalData, isClient}}>
      <CSSLoadingWarningMessage />
      <PendingNavigation routes={routes}>
        {renderRoutes(routes)}
      </PendingNavigation>
    </DocusaurusContext.Provider>
  );
}

export default App;
