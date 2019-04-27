/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext} from 'react';
import {renderRoutes} from 'react-router-config';
import Head from '@docusaurus/Head';

import Layout from '@theme/Layout'; // eslint-disable-line
import Footer from '@theme/Footer'; // eslint-disable-line
import Navbar from '@theme/Navbar'; // eslint-disable-line
import Sidebar from '@theme/Sidebar'; // eslint-disable-line

import DocusaurusContext from '@docusaurus/context';

function Doc(props) {
  const {siteConfig = {}} = useContext(DocusaurusContext);
  const {route, docsMetadata, location} = props;
  const {baseUrl, favicon} = siteConfig;
  return (
    <Layout>
      <Head>
        <title>{siteConfig.title}</title>
        {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
      </Head>
      <div className="container container--fluid">
        <div className="row">
          <div className="col col--3">
            <Sidebar docsMetadata={docsMetadata} location={location} />
          </div>
          <div className="col col--9">
            {renderRoutes(route.routes, {docsMetadata})}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Doc;
