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
import {
  DEFAULT_SEARCH_TAG,
  useTitleFormatter,
  useAlternatePageUtils,
} from '@docusaurus/theme-common';

// Useful for SEO
// See https://developers.google.com/search/docs/advanced/crawling/localized-versions
// See https://github.com/facebook/docusaurus/issues/3317
function AlternateLangHeaders(): JSX.Element {
  const {
    i18n: {defaultLocale, locales},
  } = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();
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
          hrefLang={locale === defaultLocale ? 'x-default' : locale}
        />
      ))}
    </Head>
  );
}

export default function LayoutHead(props: Props): JSX.Element {
  const {
    siteConfig,
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const {
    favicon,
    themeConfig: {image: defaultImage, metadatas},
    url: siteUrl,
  } = siteConfig;
  const {
    title,
    description,
    image,
    keywords,
    permalink,
    searchMetadatas,
  } = props;
  const metaTitle = useTitleFormatter(title);
  const metaImage = image || defaultImage;
  const metaImageUrl = useBaseUrl(metaImage, {absolute: true});
  const faviconUrl = useBaseUrl(favicon);

  // See https://github.com/facebook/docusaurus/issues/3317#issuecomment-754661855
  // const htmlLang = currentLocale.split('-')[0];
  const htmlLang = currentLocale; // should we allow the user to override htmlLang with localeConfig?

  return (
    <>
      <Head>
        <html lang={htmlLang} />
        {metaTitle && <title>{metaTitle}</title>}
        {metaTitle && <meta property="og:title" content={metaTitle} />}
        {favicon && <link rel="shortcut icon" href={faviconUrl} />}
        {description && <meta name="description" content={description} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
        {keywords && keywords.length && (
          <meta
            name="keywords"
            content={Array.isArray(keywords) ? keywords.join(',') : keywords}
          />
        )}
        {metaImage && <meta property="og:image" content={metaImageUrl} />}
        {metaImage && <meta name="twitter:image" content={metaImageUrl} />}
        {metaImage && (
          <meta name="twitter:image:alt" content={`Image for ${metaTitle}`} />
        )}
        {permalink && <meta property="og:url" content={siteUrl + permalink} />}
        {permalink && <link rel="canonical" href={siteUrl + permalink} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

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
