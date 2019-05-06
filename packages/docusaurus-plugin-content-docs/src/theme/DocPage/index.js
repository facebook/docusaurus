/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {renderRoutes} from 'react-router-config';

import Layout from '@theme/Layout'; // eslint-disable-line

import DocSidebar from '@theme/DocSidebar';

function DocPage(props) {
  const {route, docsMetadata, location} = props;

  return (
    <Layout noFooter>
      <div className="container container--fluid">
        <div className="row">
          <div className="col col--3">
            <DocSidebar docsMetadata={docsMetadata} location={location} />
          </div>
          <div className="col col--9">
            {renderRoutes(route.routes, {docsMetadata})}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DocPage;
