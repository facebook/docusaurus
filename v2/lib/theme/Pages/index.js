/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable */
import React from 'react';
import {Link} from 'react-router-dom';
import Helmet from 'react-helmet';
import Layout from '@theme/Layout'; // eslint-disable-line

export default class Pages extends React.Component {
  render() {
    const {metadata, children, siteConfig = {}} = this.props;
    const {baseUrl, favicon} = siteConfig;
    const {language} = metadata;
    return (
      <Layout {...this.props}>
        <Helmet defaultTitle={siteConfig.title}>
          {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
          {language && <html lang={language} />}
          {language && <meta name="docsearch:language" content={language} />}
        </Helmet>
        {children}
      </Layout>
    );
  }
}
