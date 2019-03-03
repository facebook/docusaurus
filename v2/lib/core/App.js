/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import {renderRoutes} from 'react-router-config';

import routes from '@generated/routes'; // eslint-disable-line
// TODO: Generalize for blog plugin.
import blogMetadata from '@generated/docusaurus-content-blog/blogMetadata.json'; // eslint-disable-line
import docsMetadatas from '@generated/docsMetadatas'; // eslint-disable-line
import env from '@generated/env'; // eslint-disable-line
import docsSidebars from '@generated/docsSidebars'; // eslint-disable-line
import pagesMetadatas from '@generated/pagesMetadatas'; // eslint-disable-line
import siteConfig from '@generated/docusaurus.config'; //eslint-disable-line

import DocusaurusContext from '@docusaurus/context';

const data = {
  blogMetadata,
  docsMetadatas,
  docsSidebars,
  env,
  pagesMetadatas,
  siteConfig,
};

function App() {
  const [context, setContext] = useState({});
  return (
    <DocusaurusContext.Provider value={{...data, ...context, setContext}}>
      {renderRoutes(routes)}
    </DocusaurusContext.Provider>
  );
}

export default App;
