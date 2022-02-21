/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';

// Permits to obtain the url of the current page in another locale
// Useful to generate hreflang meta headers etc...
// See https://developers.google.com/search/docs/advanced/crawling/localized-versions
export function useAlternatePageUtils(): {
  createUrl: ({
    locale,
    fullyQualified,
  }: {
    locale: string;
    fullyQualified: boolean;
  }) => string;
} {
  const {
    siteConfig: {baseUrl, url},
    i18n: {defaultLocale, currentLocale, localeConfigs},
  } = useDocusaurusContext();
  const {pathname} = useLocation();

  function getLocalizedPath(locale: string) {
    if (localeConfigs[locale].baseUrl) {
      return localeConfigs[locale].baseUrl
        .replace(/^\//, '')
        .replace(/\/$/, '');
    }
    return locale === defaultLocale ? '' : locale;
  }

  const currentLocalizedPath = getLocalizedPath(currentLocale);
  const baseUrlUnlocalized = baseUrl.replace(
    new RegExp(`/${currentLocalizedPath}/$`),
    '/',
  );

  const pathnameSuffix = pathname.match(new RegExp(`^${baseUrl}`))
    ? pathname.replace(new RegExp(`^${baseUrl}`), '')
    : pathname.replace(new RegExp(`^${baseUrlUnlocalized}`), '');
  function getLocalizedBaseUrl(locale: string) {
    const localizedPath = getLocalizedPath(locale);
    return localizedPath
      ? `${baseUrlUnlocalized}${localizedPath}/`
      : baseUrlUnlocalized;
  }

  // TODO support correct alternate url when localized site is deployed on another domain
  function createUrl({
    locale,
    fullyQualified,
  }: {
    locale: string;
    // For hreflang SEO headers, we need it to be fully qualified (full protocol/domain/path...)
    // For locale dropdown, using a path is good enough
    fullyQualified: boolean;
  }) {
    return `${fullyQualified ? url : ''}${getLocalizedBaseUrl(
      locale,
    )}${pathnameSuffix}`;
  }

  return {createUrl};
}
