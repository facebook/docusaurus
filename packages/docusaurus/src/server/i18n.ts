/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import importFresh from 'import-fresh';
import path from 'path';
import {I18nFile, I18n} from '@docusaurus/types';
import Joi from 'joi';

const DEFAULT_LOCALE = 'en';

const DEFAULT_LOCALIZATION_FILE: I18nFile = {
  defaultLocale: DEFAULT_LOCALE,
  locales: [DEFAULT_LOCALE],
};

const LOCALIZATION_FILE_SCHEMA = Joi.object<I18nFile>({
  defaultLocale: Joi.string().required(),
  locales: Joi.array().items().min(1).items(Joi.string().required()).required(),
})
  .optional()
  .default(DEFAULT_LOCALIZATION_FILE);

function loadI18nFileContent(siteDir: string): unknown {
  const localeJsPath = path.resolve(siteDir, 'i18n.js');
  if (fs.existsSync(localeJsPath)) {
    return importFresh(localeJsPath);
  }
  const localeJsonPath = path.resolve(siteDir, 'i18n.json');
  if (fs.existsSync(localeJsonPath)) {
    return importFresh(localeJsonPath);
  }
  return undefined;
}

function validateI18nFileContent(uncheckedFileContent: unknown): I18nFile {
  try {
    const localizationFile = Joi.attempt(
      uncheckedFileContent,
      LOCALIZATION_FILE_SCHEMA,
      {convert: false, allowUnknown: false, abortEarly: true},
    );
    if (!localizationFile.locales.includes(localizationFile.defaultLocale)) {
      throw new Error(
        `locales=${localizationFile.locales.join(
          ',',
        )} should include defaultLocale=${localizationFile.defaultLocale}`,
      );
    }
    return localizationFile;
  } catch (e) {
    throw new Error(`The docusaurus locales file looks invalid: ${e.message}`);
  }
}

function loadI18nFile(siteDir: string): I18nFile {
  const localesFileContent = loadI18nFileContent(siteDir);
  if (localesFileContent) {
    return validateI18nFileContent(localesFileContent);
  } else {
    return DEFAULT_LOCALIZATION_FILE;
  }
}

export function loadI18n(
  siteDir: string,
  options: {locale?: string} = {},
): I18n {
  const localizationFile = loadI18nFile(siteDir);
  const currentLocale = options.locale ?? localizationFile.defaultLocale;

  if (currentLocale && !localizationFile.locales.includes(currentLocale)) {
    throw new Error(
      `It is not possible to load Docusaurus with locale=[${currentLocale}], as it's not in the available locales=[${localizationFile.locales.join(
        ',',
      )}]`,
    );
  }

  return {
    ...localizationFile,
    currentLocale,
  };
}
