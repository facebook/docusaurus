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
    baseUrl: undefined,
  };
}

export function shouldWarnAboutNodeVersion(
  version: number,
  locales: string[],
): boolean {
  const isOnlyEnglish = locales.length === 1 && locales.includes('en');
  const isOlderNodeVersion = version < 14;
  return isOlderNodeVersion && !isOnlyEnglish;
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

function shouldLocalizePath({
  i18n,
  options = {},
}: {
  i18n: I18n;
  options?: {localizePath?: boolean};
}): boolean {
  if (options.localizePath === true || options.localizePath === false) {
    return options.localizePath;
  }
  if (
    i18n.currentLocale !== i18n.defaultLocale ||
    i18n.localeConfigs[i18n.currentLocale].baseUrl
  ) {
    return true;
  }
  return false;
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
  if (shouldLocalizePath({i18n, options})) {
    // FS paths need special care, for Windows support
    const localePath =
      i18n.localeConfigs[i18n.currentLocale].baseUrl ?? i18n.currentLocale;
    if (pathType === 'fs') {
      return path.join(originalPath, path.sep, localePath, path.sep);
    }
    // Url paths
    else if (pathType === 'url') {
      return normalizeUrl([originalPath, '/', localePath, '/']);
    }
    // should never happen
    else {
      throw new Error(`Unhandled path type "${pathType}".`);
    }
  } else {
    return originalPath;
  }
}
