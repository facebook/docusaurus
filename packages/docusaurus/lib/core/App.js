/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import {renderRoutes} from 'react-router-config';
import ReactListenerProvider from 'react-listener-provider';

import routes from '@generated/routes'; // eslint-disable-line
import metadata from '@generated/metadata'; // eslint-disable-line
import siteConfig from '@generated/docusaurus.config'; //eslint-disable-line
import DocusaurusContext from '@docusaurus/context'; // eslint-disable-line

function App() {
  const [context, setContext] = useState({});
  return (
    <DocusaurusContext.Provider
      value={{siteConfig, ...metadata, ...context, setContext, routes}}>
      <ReactListenerProvider>{renderRoutes(routes)}</ReactListenerProvider>
    </DocusaurusContext.Provider>
  );
}

export default App;
