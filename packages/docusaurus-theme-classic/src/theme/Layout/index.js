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

import ThemeProvider from '@theme/ThemeProvider';
import TabGroupChoiceProvider from '@theme/TabGroupChoiceProvider';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';

import './styles.css';

function Layout(props) {
  const {siteConfig = {}} = useDocusaurusContext();
  const {
    favicon,
    title: siteTitle,
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
    version,
  } = props;
  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  const metaImage = image || defaultImage;
  let metaImageUrl = siteUrl + useBaseUrl(metaImage);
  if (!isInternalUrl(metaImage)) {
    metaImageUrl = metaImage;
  }

  const faviconUrl = useBaseUrl(favicon);

  return (
    <ThemeProvider>
      <TabGroupChoiceProvider>
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
          {version && <meta name="docsearch:version" content={version} />}
          {keywords && keywords.length && (
            <meta name="keywords" content={keywords.join(',')} />
          )}
          {metaImage && <meta property="og:image" content={metaImageUrl} />}
          {metaImage && (
            <meta property="twitter:image" content={metaImageUrl} />
          )}
          {metaImage && (
            <meta name="twitter:image:alt" content={`Image for ${metaTitle}`} />
          )}
          {permalink && (
            <meta property="og:url" content={siteUrl + permalink} />
          )}
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <Navbar />
        <div className="main-wrapper">{children}</div>
        {!noFooter && <Footer />}
      </TabGroupChoiceProvider>
    </ThemeProvider>
  );
}

export default Layout;
