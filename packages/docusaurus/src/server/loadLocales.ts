/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import importFresh from 'import-fresh';
import path from 'path';
import {LocalizationFile} from '@docusaurus/types';

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

// TODO proper validation with Joi schema
function validateLocalesFile(localesFile: unknown) {
  // @ts-expect-error: todo refactor, temp
  if (!localesFile.defaultLocale || !localesFile.locales) {
    throw new Error(`locales file look bad: ${localesFile}`);
  }
  return localesFile as LocalizationFile;
}

export default function loadLocales(siteDir: string): LocalizationFile {
  const localesFileContent = loadLocalesFile(siteDir);
  if (localesFileContent) {
    return validateLocalesFile(localesFileContent);
  } else {
    // TODO not sure if we should make these defaults configurable
    // locales.json is already a way to configure...
    return {defaultLocale: 'en', locales: ['en']};
  }
}
