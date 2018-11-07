/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {renderRoutes} from 'react-router-config';

import routes from '@generated/routes'; // eslint-disable-line
import blogMetadatas from '@generated/blogMetadatas'; // eslint-disable-line
import docsMetadatas from '@generated/docsMetadatas'; // eslint-disable-line
import env from '@generated/env'; // eslint-disable-line
import docsSidebars from '@generated/docsSidebars'; // eslint-disable-line
import pagesMetadatas from '@generated/pagesMetadatas'; // eslint-disable-line
import siteConfig from '@generated/siteConfig'; //eslint-disable-line

import DocusaurusContext from '@docusaurus/context';

const data = {
  blogMetadatas,
  docsMetadatas,
  docsSidebars,
  env,
  pagesMetadatas,
  siteConfig,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setContext: context => {
        this.setState(context);
      },
    };
  }

  render() {
    return (
      <DocusaurusContext.Provider value={{...data, ...this.state}}>
        {renderRoutes(routes)}
      </DocusaurusContext.Provider>
    );
  }
}

export default App;
