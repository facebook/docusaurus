/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import importFresh from 'import-fresh';
import path from 'path';
import {LocalizationFile, LocalizationContext} from '@docusaurus/types';
import Joi from '@hapi/joi';

const DEFAULT_LOCALE = 'en';

const DEFAULT_LOCALIZATION_FILE: LocalizationFile = {
  defaultLocale: DEFAULT_LOCALE,
  locales: [DEFAULT_LOCALE],
};

const LOCALIZATION_FILE_SCHEMA = Joi.object<LocalizationFile>({
  defaultLocale: Joi.string().required(),
  locales: Joi.array().items().min(1).items(Joi.string().required()).required(),
})
  .optional()
  .default(DEFAULT_LOCALIZATION_FILE);

function loadLocalesFile(siteDir: string): unknown {
  const localeJsPath = path.resolve(siteDir, 'locales.js');
  if (fs.existsSync(localeJsPath)) {
    return importFresh(localeJsPath);
  }
  const localeJsonPath = path.resolve(siteDir, 'locales.json');
  if (fs.existsSync(localeJsonPath)) {
    return importFresh(localeJsonPath);
  }
  return undefined;
}

function validateLocalesFile(
  unsafeLocalizationFile: unknown,
): LocalizationFile {
  try {
    const localizationFile = Joi.attempt(
      unsafeLocalizationFile,
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

function loadLocalizationFile(siteDir: string): LocalizationFile {
  const localesFileContent = loadLocalesFile(siteDir);
  if (localesFileContent) {
    return validateLocalesFile(localesFileContent);
  } else {
    return DEFAULT_LOCALIZATION_FILE;
  }
}

export function loadLocalizationContext(
  siteDir: string,
  options: {locale?: string} = {},
): LocalizationContext {
  const localizationFile = loadLocalizationFile(siteDir);
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
