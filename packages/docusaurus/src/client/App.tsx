/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState} from 'react';

import routes from '@generated/routes';
import siteConfig from '@generated/docusaurus.config';
import globalData from '@generated/globalData';
import i18n from '@generated/i18n';
import codeTranslations from '@generated/codeTranslations';
import siteMetadata from '@generated/site-metadata';
import renderRoutes from './exports/renderRoutes';
import DocusaurusContext from './exports/context';
import PendingNavigation from './PendingNavigation';
import BaseUrlIssueBanner from './baseUrlIssueBanner/BaseUrlIssueBanner';
import Root from '@theme/Root';

import './client-lifecycles-dispatcher';

function App(): JSX.Element {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <DocusaurusContext.Provider
      value={{
        siteConfig,
        siteMetadata,
        globalData,
        i18n,
        codeTranslations,
        isClient,
      }}>
      <Root>
        <BaseUrlIssueBanner />
        <PendingNavigation routes={routes}>
          {renderRoutes(routes)}
        </PendingNavigation>
      </Root>
    </DocusaurusContext.Provider>
  );
}

export default App;
