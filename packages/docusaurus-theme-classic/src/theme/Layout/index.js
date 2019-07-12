/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withBaseUrl from '@docusaurus/withBaseUrl';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';

import './styles.css';

function Layout(props) {
  const {siteConfig = {}} = useDocusaurusContext();
  const {
    favicon,
    tagline,
    title: defaultTitle,
    themeConfig: {image: defaultImage},
    url: siteUrl,
  } = siteConfig;
  const {
    children,
    title,
    noFooter,
    description,
    image,
    keywords,
    permalink,
  } = props;
  const metaTitle = title || defaultTitle;
  const metaImage = `${siteUrl}${withBaseUrl(image || defaultImage)}`;
  return (
    <React.Fragment>
      <Head defaultTitle={`${defaultTitle} · ${tagline}`}>
        <meta property="og:site_name" content={defaultTitle} />
        {metaTitle && <title>{`${metaTitle} · ${tagline}`}</title>}
        {metaTitle && <meta property="og:title" content={metaTitle} />}
        {favicon && <link rel="shortcut icon" href={withBaseUrl(favicon)} />}
        {description && <meta name="description" content={description} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
        {keywords && keywords.length && (
          <meta property="keywords" content={keywords} />
        )}
        {metaImage && <meta property="og:image" content={metaImage} />}
        {metaImage && <meta property="twitter:image" content={metaImage} />}
        {metaImage && metaTitle && (
          <meta name="twitter:image:alt" content={`Image for ${metaTitle}`} />
        )}
        {permalink && <meta property="og:url" content={siteUrl + permalink} />}
        <meta
          name="twitter:card"
          content={image || favicon ? 'summary_large_image' : 'summary'}
        />
      </Head>
      <Navbar />
      {children}
      {!noFooter && <Footer />}
    </React.Fragment>
  );
}

export default Layout;
