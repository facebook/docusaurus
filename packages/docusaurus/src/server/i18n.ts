/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {I18n, DocusaurusConfig, I18nLocaleConfig} from '@docusaurus/types';
import path from 'path';
import {normalizeUrl} from '@docusaurus/utils';

export function defaultLocaleConfig(locale: string): I18nLocaleConfig {
  return {
    label: locale,
  };
}

export async function loadI18n(
  config: DocusaurusConfig,
  options: {locale?: string} = {},
): Promise<I18n> {
  const i18nConfig = config.i18n;
  const currentLocale = options.locale ?? i18nConfig.defaultLocale;

  if (currentLocale && !i18nConfig.locales.includes(currentLocale)) {
    throw new Error(
      `It is not possible to load Docusaurus with locale="${currentLocale}".
This locale is not in the available locales of your site configuration: config.i18n.locales=[${i18nConfig.locales.join(
        ',',
      )}]
Note: Docusaurus only support running one local at a time.`,
    );
  }

  function getLocaleConfig(locale: string): I18nLocaleConfig {
    // User provided values
    const localeConfigOptions: Partial<I18nLocaleConfig> =
      i18nConfig.localeConfigs[locale];

    return {...defaultLocaleConfig(locale), ...localeConfigOptions};
  }

  const localeConfigs = i18nConfig.locales.reduce((acc, locale) => {
    return {...acc, [locale]: getLocaleConfig(locale)};
  }, {});

  return {
    ...i18nConfig,
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
      throw new Error(`unhandled pathType=${pathType}`);
    }
  } else {
    return originalPath;
  }
}
