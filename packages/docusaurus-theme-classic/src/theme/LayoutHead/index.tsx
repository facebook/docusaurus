/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import type {Props} from '@theme/Layout';
import SearchMetadatas from '@theme/SearchMetadatas';
import Seo from '@theme/Seo';
import {
  DEFAULT_SEARCH_TAG,
  useTitleFormatter,
  useAlternatePageUtils,
  useThemeConfig,
} from '@docusaurus/theme-common';
import {useLocation} from '@docusaurus/router';

// Useful for SEO
// See https://developers.google.com/search/docs/advanced/crawling/localized-versions
// See https://github.com/facebook/docusaurus/issues/3317
function AlternateLangHeaders(): JSX.Element {
  const {
    i18n: {defaultLocale, locales},
  } = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();

  // Note: it is fine to use both "x-default" and "en" to target the same url
  // See https://www.searchviu.com/en/multiple-hreflang-tags-one-url/
  return (
    <Head>
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          href={alternatePageUtils.createUrl({
            locale,
            fullyQualified: true,
          })}
          hrefLang={locale}
        />
      ))}
      <link
        rel="alternate"
        href={alternatePageUtils.createUrl({
          locale: defaultLocale,
          fullyQualified: true,
        })}
        hrefLang="x-default"
      />
    </Head>
  );
}

// Default canonical url inferred from current page location pathname
function useDefaultCanonicalUrl() {
  const {
    siteConfig: {url: siteUrl},
  } = useDocusaurusContext();
  const {pathname} = useLocation();
  return siteUrl + useBaseUrl(pathname);
}

function CanonicalUrlHeaders({permalink}: {permalink?: string}) {
  const {
    siteConfig: {url: siteUrl},
  } = useDocusaurusContext();
  const defaultCanonicalUrl = useDefaultCanonicalUrl();

  const canonicalUrl = permalink
    ? `${siteUrl}${permalink}`
    : defaultCanonicalUrl;
  return (
    <Head>
      <meta property="og:url" content={canonicalUrl} />
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}

export default function LayoutHead(props: Props): JSX.Element {
  const {
    siteConfig: {favicon},
    i18n: {currentLocale, localeConfigs},
  } = useDocusaurusContext();
  const {metadatas, image: defaultImage} = useThemeConfig();
  const {title, description, image, keywords, searchMetadatas} = props;
  const faviconUrl = useBaseUrl(favicon);
  const pageTitle = useTitleFormatter(title);

  // See https://github.com/facebook/docusaurus/issues/3317#issuecomment-754661855
  // const htmlLang = currentLocale.split('-')[0];
  const htmlLang = currentLocale; // should we allow the user to override htmlLang with localeConfig?
  const htmlDir = localeConfigs[currentLocale].direction;

  return (
    <>
      <Head>
        <html lang={htmlLang} dir={htmlDir} />
        {favicon && <link rel="shortcut icon" href={faviconUrl} />}
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* image can override the default image */}
      {defaultImage && <Seo image={defaultImage} />}
      {image && <Seo image={image} />}

      <Seo description={description} keywords={keywords} />

      <CanonicalUrlHeaders />

      <AlternateLangHeaders />

      <SearchMetadatas
        tag={DEFAULT_SEARCH_TAG}
        locale={currentLocale}
        {...searchMetadatas}
      />

      <Head
      // it's important to have an additional <Head> element here,
      // as it allows react-helmet to override values set in previous <Head>
      // ie we can override default metadatas such as "twitter:card"
      // In same Head, the same meta would appear twice instead of overriding
      // See react-helmet doc
      >
        {metadatas.map((metadata, i) => (
          <meta key={`metadata_${i}`} {...metadata} />
        ))}
      </Head>
    </>
  );
}
