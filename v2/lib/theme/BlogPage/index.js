/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext} from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout'; // eslint-disable-line
import BlogPost from '@theme/BlogPost'; // eslint-disable-line

import DocusaurusContext from '@docusaurus/context';

function BlogPage(props) {
  const context = useContext(DocusaurusContext);
  console.log(context);
  const {blogMetadatas, language, siteConfig = {}} = context;
  const {baseUrl, favicon} = siteConfig;

  return (
    <Layout>
      <Head>
        <title>Blog</title>
        {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
        {language && <html lang={language} />}
        {language && <meta name="docsearch:language" content={language} />}
      </Head>
      <div>
        <ul>
          {blogMetadatas.map(metadata => (
            <li key={metadata.permalink}>
              <Link to={metadata.permalink}>{metadata.permalink}</Link>
            </li>
          ))}
        </ul>
        {props.children}
      </div>
    </Layout>
  );
}

export default BlogPage;
