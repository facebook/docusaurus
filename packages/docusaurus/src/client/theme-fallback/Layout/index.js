/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function Layout(props) {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {baseUrl, favicon, tagline, title: defaultTitle} = siteConfig;
  const {children, title} = props;
  return (
    <React.Fragment>
      <Head defaultTitle={`${defaultTitle} · ${tagline}`}>
        {title && <title>{`${title} · ${tagline}`}</title>}
        {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
      </Head>
      {children}
    </React.Fragment>
  );
}

export default Layout;
