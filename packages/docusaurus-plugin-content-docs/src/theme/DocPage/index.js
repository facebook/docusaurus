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

import './styles.css';

function DocPage(props) {
  const {route, docsMetadata, location} = props;
  const {permalinkToId} = docsMetadata;
  const id =
    permalinkToId[location.pathname] ||
    permalinkToId[location.pathname.replace(/\/$/, '')];
  const metadata = docsMetadata.docs[id] || {};
  const {sidebar, description} = metadata;

  return (
    <Layout noFooter description={description}>
      <div className="container container--fluid">
        <div>
          <div className="sidebar__container">
            <DocSidebar docsMetadata={docsMetadata} sidebar={sidebar} />
          </div>
          <div className="content__container">
            {renderRoutes(route.routes, {docsMetadata})}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DocPage;
