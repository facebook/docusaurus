/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import logger from '@docusaurus/logger';
import combinePromises from 'combine-promises';
import {normalizeUrl} from '@docusaurus/utils';
import type {I18n, DocusaurusConfig, I18nLocaleConfig} from '@docusaurus/types';

function inferLanguageDisplayName(locale: string) {
  const tryLocale = (l: string) => {
    try {
      return new Intl.DisplayNames(l, {
        type: 'language',
        fallback: 'code',
      }).of(l)!;
    } catch (e) {
      // This is to compensate "of()" that is a bit strict
      // Looks like starting Node 22, this locale throws: "en-US-u-ca-buddhist"
      // RangeError: invalid_argument
      return null;
    }
  };

  const parts = locale.split('-');

  // This is a best effort, we try various locale forms that could give a result
  return (
    tryLocale(locale) ??
    tryLocale(`${parts[0]}-${parts[1]}`) ??
    tryLocale(parts[0]!)
  );
}

function getDefaultLocaleLabel(locale: string) {
  const languageName = inferLanguageDisplayName(locale);
  if (!languageName) {
    return locale;
  }
  return (
    languageName.charAt(0).toLocaleUpperCase(locale) + languageName.substring(1)
  );
}

function getDefaultCalendar(localeStr: string) {
  const locale = new Intl.Locale(localeStr);

  // If the locale name includes -u-ca-xxx the calendar will be defined
  if (locale.calendar) {
    return locale.calendar;
  }

  // Not well-supported but server code can infer a calendar from the locale
  // See https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getCalendars
  // See https://caniuse.com/mdn-javascript_builtins_intl_locale_getcalendars
  const calendars =
    // @ts-expect-error: new std method (Bun/JSC/WebKit)
    locale.getCalendars?.() ??
    // @ts-expect-error: non-std attribute (V8/Chromium/Node)
    locale.calendars;

  if (calendars instanceof Array && calendars[0]) {
    return calendars[0];
  }

  return 'gregory';
}

function getDefaultDirection(localeStr: string) {
  const locale = new Intl.Locale(localeStr);
  // see https://github.com/tc39/proposal-intl-locale-info
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getTextInfo
  // Node 18.0 implements a former version of the getTextInfo() proposal
  // @ts-expect-error: The TC39 proposal was updated
  const textInto = locale.getTextInfo?.() ?? locale.textInfo;
  return textInto.direction;
}

export function getDefaultLocaleConfig(
  locale: string,
): Omit<I18nLocaleConfig, 'translate' | 'url' | 'baseUrl'> {
  try {
    return {
      label: getDefaultLocaleLabel(locale),
      direction: getDefaultDirection(locale),
      htmlLang: locale,
      calendar: getDefaultCalendar(locale),
      path: locale,
    };
  } catch (e) {
    throw new Error(
      `Docusaurus couldn't get default locale config for ${locale}`,
      {cause: e},
    );
  }
}

export async function loadI18n({
  siteDir,
  config,
  currentLocale,
  automaticBaseUrlLocalizationDisabled,
}: {
  siteDir: string;
  config: DocusaurusConfig;
  currentLocale: string;
  automaticBaseUrlLocalizationDisabled: boolean;
}): Promise<I18n> {
  const {i18n: i18nConfig} = config;

  if (!i18nConfig.locales.includes(currentLocale)) {
    logger.warn`The locale name=${currentLocale} was not found in your site configuration: Available locales are: ${i18nConfig.locales}
Note: Docusaurus only support running one locale at a time.`;
  }

  const locales = i18nConfig.locales.includes(currentLocale)
    ? i18nConfig.locales
    : (i18nConfig.locales.concat(currentLocale) as [string, ...string[]]);

  async function getFullLocaleConfig(
    locale: string,
  ): Promise<I18nLocaleConfig> {
    const localeConfigInput = i18nConfig.localeConfigs[locale] ?? {};
    const localeConfig: Omit<
      I18nLocaleConfig,
      'translate' | 'url' | 'baseUrl'
    > = {
      ...getDefaultLocaleConfig(locale),
      ...localeConfigInput,
    };

    // By default, translations will be enabled if i18n/<locale> dir exists
    async function inferTranslate() {
      const localizationDir = path.resolve(
        siteDir,
        i18nConfig.path,
        localeConfig.path,
      );
      return fs.pathExists(localizationDir);
    }

    function getInferredBaseUrl(): string {
      const addLocaleSegment =
        locale !== i18nConfig.defaultLocale &&
        !automaticBaseUrlLocalizationDisabled;

      return normalizeUrl([
        '/',
        config.baseUrl,
        addLocaleSegment ? locale : '',
        '/',
      ]);
    }

    const translate = localeConfigInput.translate ?? (await inferTranslate());

    const url =
      typeof localeConfigInput.url !== 'undefined'
        ? localeConfigInput.url
        : config.url;

    const baseUrl =
      typeof localeConfigInput.baseUrl !== 'undefined'
        ? normalizeUrl(['/', localeConfigInput.baseUrl, '/'])
        : getInferredBaseUrl();

    return {
      ...localeConfig,
      translate,
      url,
      baseUrl,
    };
  }

  const localeConfigs = await combinePromises(
    Object.fromEntries(
      locales.map((locale) => [locale, getFullLocaleConfig(locale)]),
    ),
  );

  return {
    defaultLocale: i18nConfig.defaultLocale,
    locales,
    path: i18nConfig.path,
    currentLocale,
    localeConfigs,
  };
}
