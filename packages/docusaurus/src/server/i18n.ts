/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {I18n, DocusaurusConfig, I18nLocaleConfig} from '@docusaurus/types';
import path from 'path';
import {normalizeUrl} from '@docusaurus/utils';
import {getLangDir} from 'rtl-detect';
import logger from '@docusaurus/logger';

function getDefaultLocaleLabel(locale: string) {
  const languageName = new Intl.DisplayNames(locale, {type: 'language'}).of(
    locale,
  );
  return (
    languageName.charAt(0).toLocaleUpperCase(locale) + languageName.substring(1)
  );
}

export function getDefaultLocaleConfig(locale: string): I18nLocaleConfig {
  return {
    label: getDefaultLocaleLabel(locale),
    direction: getLangDir(locale),
    htmlLang: locale,
  };
}

export async function loadI18n(
  config: DocusaurusConfig,
  options: {locale?: string} = {},
): Promise<I18n> {
  const {i18n: i18nConfig} = config;

  const currentLocale = options.locale ?? i18nConfig.defaultLocale;

  if (!i18nConfig.locales.includes(currentLocale)) {
    logger.warn`The locale name=${currentLocale} was not found in your site configuration: Available locales are: ${i18nConfig.locales}
Note: Docusaurus only support running one locale at a time.`;
  }

  const locales = i18nConfig.locales.includes(currentLocale)
    ? i18nConfig.locales
    : (i18nConfig.locales.concat(currentLocale) as [string, ...string[]]);

  function getLocaleConfig(locale: string): I18nLocaleConfig {
    return {
      ...getDefaultLocaleConfig(locale),
      ...i18nConfig.localeConfigs[locale],
    };
  }

  const localeConfigs = locales.reduce(
    (acc, locale) => ({...acc, [locale]: getLocaleConfig(locale)}),
    {},
  );

  return {
    defaultLocale: i18nConfig.defaultLocale,
    locales,
    currentLocale,
    localeConfigs,
  };
}

export function localizePath({
  pathType,
  path: originalPath,
  i18n,
  options = {},
}: {
  pathType: 'fs' | 'url';
  path: string;
  i18n: I18n;
  options?: {localizePath?: boolean};
}): string {
  const shouldLocalizePath: boolean =
    // By default, we don't localize the path of defaultLocale
    options.localizePath ?? i18n.currentLocale !== i18n.defaultLocale;

  if (!shouldLocalizePath) {
    return originalPath;
  }
  // FS paths need special care, for Windows support
  if (pathType === 'fs') {
    return path.join(originalPath, i18n.currentLocale);
  }
  // Url paths; add a trailing slash so it's a valid base URL
  if (pathType === 'url') {
    return normalizeUrl([originalPath, i18n.currentLocale, '/']);
  }
  // should never happen
  throw new Error(`Unhandled path type "${pathType}".`);
}
