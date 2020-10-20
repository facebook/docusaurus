/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Head from '@docusaurus/Head';
import isInternalUrl from '@docusaurus/isInternalUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import type {Props} from '@theme/Layout';

function Layout(props: Props): JSX.Element {
  const {siteConfig = {}} = useDocusaurusContext();
  const {
    favicon,
    title: siteTitle,
    themeConfig: {image: defaultImage, metadatas},
    url: siteUrl,
    titleDelimiter,
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
  const metaTitle = title
    ? `${title} ${titleDelimiter} ${siteTitle}`
    : siteTitle;
  const metaImage = image || defaultImage;
  let metaImageUrl = siteUrl + useBaseUrl(metaImage);
  if (!isInternalUrl(metaImage)) {
    metaImageUrl = metaImage;
  }
  const faviconUrl = useBaseUrl(favicon);

  return (
    <div className="container-fluid vh-100 vw-100 row m-0 p-0">
      <Head>
        {/* TODO: Do not assume that it is in english language */}
        <html lang="en" />

        {metaTitle && <title>{metaTitle}</title>}
        {metaTitle && <meta property="og:title" content={metaTitle} />}
        {favicon && <link rel="shortcut icon" href={faviconUrl} />}
        {description && <meta name="description" content={description} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
        {keywords && keywords.length && (
          <meta name="keywords" content={keywords.join(',')} />
        )}
        {metaImage && <meta property="og:image" content={metaImageUrl} />}
        {metaImage && <meta property="twitter:image" content={metaImageUrl} />}
        {metaImage && (
          <meta name="twitter:image:alt" content={`Image for ${metaTitle}`} />
        )}
        {permalink && <meta property="og:url" content={siteUrl + permalink} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Head
      // it's important to have an additional <Head> element here,
      // as it allows react-helmet to override values set in previous <Head>
      // ie we can override default metadatas such as "twitter:card"
      // In same Head, the same meta would appear twice instead of overriding
      // See react-helmet doc
      >
        {metadatas?.length > 0 &&
          metadatas.map((metadata, i) => (
            <meta key={`metadata_${i}`} {...metadata} />
          ))}
      </Head>
      <Navbar />
      <div className="container-fluid px-0 d-inline-flex flex-row">
        {children}
      </div>
      {!noFooter && <Footer />}
    </div>
  );
}

export default Layout;
