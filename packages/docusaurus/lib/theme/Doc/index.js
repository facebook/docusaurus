/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext} from 'react';
import {renderRoutes} from 'react-router-config';
import Head from '@docusaurus/Head';

import Footer from '@theme/Footer'; // eslint-disable-line
import Navbar from '@theme/Navbar'; // eslint-disable-line
import Sidebar from '@theme/Sidebar'; // eslint-disable-line

import DocusaurusContext from '@docusaurus/context';

import styles from './styles.module.css';

function Doc(props) {
  const {metadata = {}, siteConfig = {}} = useContext(DocusaurusContext);
  const {route} = props;
  const {language, version} = metadata;
  const {baseUrl, favicon} = siteConfig;

  return (
    <div>
      <Head>
        <title>{(metadata && metadata.title) || siteConfig.title}</title>
        {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
        {language && <html lang={language} />}
        {language && <meta name="docsearch:language" content={language} />}
        {version && <meta name="docsearch:version" content={version} />}
      </Head>
      <Navbar />
      <Sidebar />
      <div className={styles.mainContainer}>
        <div className={styles.docContainer}>{renderRoutes(route.routes)}</div>
      </div>
    </div>
  );
}

export default Doc;
