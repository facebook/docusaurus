/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {I18n, DocusaurusConfig, I18nLocaleConfig} from '@docusaurus/types';
import path from 'path';
import {normalizeUrl, NODE_MAJOR_VERSION} from '@docusaurus/utils';
import {getLangDir} from 'rtl-detect';
import chalk from 'chalk';

function getDefaultLocaleLabel(locale: string) {
  // Intl.DisplayNames is ES2021 - Node14+
  // https://v8.dev/features/intl-displaynames
  if (typeof Intl.DisplayNames !== 'undefined') {
    const languageName = new Intl.DisplayNames(locale, {type: 'language'}).of(
      locale,
    );
    return (
      languageName.charAt(0).toLocaleUpperCase(locale) +
      languageName.substring(1)
    );
  }
  return locale;
}

export function getDefaultLocaleConfig(locale: string): I18nLocaleConfig {
  return {
    label: getDefaultLocaleLabel(locale),
    direction: getLangDir(locale),
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
    console.warn(
      chalk.yellow(
        `The locale "${currentLocale}" was not found in your site configuration: Available locales are: ${i18nConfig.locales.join(
          ',',
        )}.
Note: Docusaurus only support running one locale at a time.`,
      ),
    );
  }

  const locales = i18nConfig.locales.includes(currentLocale)
    ? i18nConfig.locales
    : (i18nConfig.locales.concat(currentLocale) as [string, ...string[]]);

  if (shouldWarnAboutNodeVersion(NODE_MAJOR_VERSION, locales)) {
    console.warn(
      chalk.yellow(
        `To use Docusaurus i18n, it is strongly advised to use Node.js 14 or later (instead of ${NODE_MAJOR_VERSION}).`,
      ),
    );
  }

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
    typeof options.localizePath === 'undefined'
      ? // By default, we don't localize the path of defaultLocale
        i18n.currentLocale !== i18n.defaultLocale
      : options.localizePath;

  if (shouldLocalizePath) {
    // FS paths need special care, for Windows support
    if (pathType === 'fs') {
      return path.join(originalPath, path.sep, i18n.currentLocale, path.sep);
    }
    // Url paths
    else if (pathType === 'url') {
      return normalizeUrl([originalPath, '/', i18n.currentLocale, '/']);
    }
    // should never happen
    else {
      throw new Error(`Unhandled path type "${pathType}".`);
    }
  } else {
    return originalPath;
  }
}
