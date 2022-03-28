/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getLangDir} from 'rtl-detect';
import logger from '@docusaurus/logger';
import type {I18n, DocusaurusConfig, I18nLocaleConfig} from '@docusaurus/types';

function getDefaultLocaleLabel(locale: string) {
  const languageName = new Intl.DisplayNames(locale, {type: 'language'}).of(
    locale,
  )!;
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
  options: {locale?: string},
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
