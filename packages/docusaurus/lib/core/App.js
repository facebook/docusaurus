/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import {renderRoutes} from 'react-router-config';

import routes from '@generated/routes'; // eslint-disable-line
import metadata from '@generated/metadata'; // eslint-disable-line
import siteConfig from '@generated/docusaurus.config'; //eslint-disable-line
import DocusaurusContext from '@docusaurus/context'; // eslint-disable-line

// TODO: Allow choosing prismjs theme.
import 'prismjs/themes/prism.css';

function App() {
  const [context, setContext] = useState({});
  return (
    <DocusaurusContext.Provider
      value={{siteConfig, ...metadata, ...context, setContext}}>
      {renderRoutes(routes)}
    </DocusaurusContext.Provider>
  );
}

export default App;
