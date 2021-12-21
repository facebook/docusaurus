/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';

function getDefaultLocalesDirPath(): string {
  return path.join(__dirname, '../locales');
}

// Return an ordered list of locales we should try
export function codeTranslationLocalesToTry(locale: string): string[] {
  const intlLocale = Intl.Locale ? new Intl.Locale(locale) : undefined;
  if (!intlLocale) {
    return [locale];
  }
  // if locale is just a simple language like "pt", we want to fallback to pt-BR (not pt-PT!)
  // see https://github.com/facebook/docusaurus/pull/4536#issuecomment-810088783
  if (intlLocale.language === locale) {
    const maximizedLocale = intlLocale.maximize(); // pt-Latn-BR`
    // ["pt","pt-BR"]
    return [locale, `${maximizedLocale.language}-${maximizedLocale.region}`];
  }
  // if locale is like "pt-BR", we want to fallback to "pt"
  else {
    return [locale, intlLocale.language!];
  }
}

// Useful to implement getDefaultCodeTranslationMessages() in themes
export async function readDefaultCodeTranslationMessages({
  dirPath = getDefaultLocalesDirPath(),
  locale,
  name,
}: {
  dirPath?: string;
  locale: string;
  name: string;
}): Promise<Record<string, string>> {
  const localesToTry = codeTranslationLocalesToTry(locale);

  // Return the content of the first file that match
  // fr_FR.json => fr.json => nothing
  // eslint-disable-next-line no-restricted-syntax
  for (const localeToTry of localesToTry) {
    const filePath = path.resolve(dirPath, localeToTry, `${name}.json`);

    if (await fs.pathExists(filePath)) {
      const fileContent = await fs.readFile(filePath, 'utf8');
      return JSON.parse(fileContent);
    }
  }

  return {};
}
