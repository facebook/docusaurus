/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext} from 'react';
import Head from '@docusaurus/Head'; // eslint-disable-line
import Footer from '@theme/Footer'; // eslint-disable-line
import Layout from '@theme/Layout'; // eslint-disable-line

import DocusaurusContext from '@docusaurus/context';

function Pages({content}) {
  const context = useContext(DocusaurusContext);
  const {metadata = {}, siteConfig = {}} = context;
  const {baseUrl, favicon} = siteConfig;
  const {language} = metadata;
  const PageContents = content;

  return (
    <Layout>
      <Head defaultTitle={siteConfig.title}>
        {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
        {language && <html lang={language} />}
        {language && <meta name="docsearch:language" content={language} />}
      </Head>
      <PageContents />
      <Footer />
    </Layout>
  );
}

export default Pages;
