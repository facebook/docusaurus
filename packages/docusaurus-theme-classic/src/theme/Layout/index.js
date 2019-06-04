/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withBaseUrl from '@docusaurus/withBaseUrl';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import MDXComponents from '@theme/MDXComponents';

import './styles.css';

function Layout(props) {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {favicon, tagline, title: defaultTitle} = siteConfig;
  const {children, title, noFooter, description} = props;
  return (
    <React.Fragment>
      <Head defaultTitle={`${defaultTitle} · ${tagline}`}>
        {title && <title>{`${title} · ${tagline}`}</title>}
        {favicon && <link rel="shortcut icon" href={withBaseUrl(favicon)} />}
        {description && <meta name="description" content={description} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
      </Head>
      <Navbar />
      <MDXProvider components={MDXComponents}>{children}</MDXProvider>
      {!noFooter && <Footer />}
    </React.Fragment>
  );
}

export default Layout;
