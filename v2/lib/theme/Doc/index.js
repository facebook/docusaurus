/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext} from 'react';
import {Route} from 'react-router-dom';
import Helmet from 'react-helmet';

import Footer from '@theme/Footer'; // eslint-disable-line
import Navbar from '@theme/Navbar'; // eslint-disable-line
import Sidebar from '@theme/Sidebar'; // eslint-disable-line

import DocusaurusContext from '../../core/docusaurus-context';

import styles from './styles.module.css';

function Doc(props) {
  const {metadata = {}, siteConfig = {}} = useContext(DocusaurusContext);
  const {route} = props;
  const {language, version} = metadata;
  const {baseUrl, favicon} = siteConfig;

  return (
    <div>
      <Helmet>
        <title>{(metadata && metadata.title) || siteConfig.title}</title>
        {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
        {language && <html lang={language} />}
        {language && <meta name="docsearch:language" content={language} />}
        {version && <meta name="docsearch:version" content={version} />}
      </Helmet>
      <Navbar />
      <Sidebar />
      <div className={styles.mainContainer}>
        <div className={styles.docContainer}>
          {route.routes.map(routeObject => (
            <Route
              key={routeObject.path}
              path={routeObject.path}
              render={routeProps => (
                <routeObject.component
                  {...routeProps}
                  routes={routeObject.routes}
                />
              )}
            />
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Doc;
