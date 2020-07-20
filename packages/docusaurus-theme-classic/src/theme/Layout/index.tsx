/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import ThemeProvider from '@theme/ThemeProvider';
import UserPreferencesProvider from '@theme/UserPreferencesProvider';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';

import './styles.css';

type Props = {
  children: ReactNode;
  title?: string;
  noFooter?: boolean;
  description?: string;
  image?: string;
  keywords?: string[];
  permalink?: string;
  version?: string;
  type?: string;
};

function Layout(props: Props): JSX.Element {
  const {siteConfig = {}} = useDocusaurusContext();
  const {
    favicon,
    title: siteTitle,
    themeConfig: {
      image: defaultImage,
      navbar: {
        logo: {src: logo},
      },
    },
    url: siteUrl,
    dynamicMetaImage: {
      apiUrl = 'https://og-image.now.sh',
      docusaurusStamp = true,
    },
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
    type,
  } = props;

  const generateImageUrl = (
    ogUrl,
    ogTitle,
    ogSiteTitle,
    ogVersion,
    ogLogo,
    ogType,
    ogStamp,
  ) => {
    const url = `${ogUrl}/${ogTitle}.png?siteTitle=${ogSiteTitle}&images=${ogLogo}&version=${ogVersion}&type=${ogType}&stamp=${ogStamp}`;
    return encodeURI(url);
  };

  const faviconUrl = useBaseUrl(favicon);
  const logoUrl = useBaseUrl(logo, {absolute: true});
  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaImage = image || defaultImage;
  const localMetaImageUrl = useBaseUrl(metaImage, {absolute: true});
  const metaImageUrl = metaImage
    ? localMetaImageUrl
    : generateImageUrl(
        apiUrl,
        metaTitle,
        title,
        version,
        logoUrl,
        type,
        docusaurusStamp,
      );

  return (
    <ThemeProvider>
      <UserPreferencesProvider>
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
          <meta property="og:image" content={metaImageUrl} />
          {metaImage && (
            <meta property="twitter:image" content={metaImageUrl} />
          )}
          {metaImage && (
            <meta name="twitter:image:alt" content={`Image for ${metaTitle}`} />
          )}
          {permalink && (
            <meta property="og:url" content={siteUrl + permalink} />
          )}
          {permalink && <link rel="canonical" href={siteUrl + permalink} />}
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <AnnouncementBar />
        <Navbar />
        <div className="main-wrapper">{children}</div>
        {!noFooter && <Footer />}
      </UserPreferencesProvider>
    </ThemeProvider>
  );
}

export default Layout;
