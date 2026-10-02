/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import type {CodeTranslations} from '@docusaurus/types';

// Inlined instead of depending on @docusaurus/utils, to keep this package tiny
async function pathExists(filePath: string): Promise<boolean> {
  return fs.access(filePath).then(
    () => true,
    () => false,
  );
}

// JSON.parse() rejects a leading UTF-8 BOM (U+FEFF) character, but some
// editors (such as Windows Notepad) add one when saving files
function stripUTF8BOM(content: string): string {
  return content.startsWith('\uFEFF') ? content.slice(1) : content;
}

async function readJSON(filePath: string): Promise<unknown> {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(stripUTF8BOM(content));
  } catch (err) {
    throw new Error(
      `Failed to read JSON file at "${path.relative(process.cwd(), filePath)}"`,
      {cause: err},
    );
  }
}

function getDefaultLocalesDirPath(): string {
  return path.join(__dirname, '../locales');
}

// Return an ordered list of locales we should try
export function codeTranslationLocalesToTry(locale: string): string[] {
  const intlLocale = new Intl.Locale(locale);
  // If locale is just a simple language like "pt", we want to fallback to
  // "pt-BR" (not "pt-PT"!)
  // See https://github.com/facebook/docusaurus/pull/4536#issuecomment-810088783
  const maximizedLocale = intlLocale.maximize(); // "pt-Latn-BR"
  return [
    // May be "zh", "zh-CN", "zh-Hans", "zh-cn", or anything: very likely to be
    // unresolved except for simply locales
    locale,
    // "zh-CN" / "pt-BR"
    `${maximizedLocale.language!}-${maximizedLocale.region!}`,
    // "zh-Hans" / "pt-Latn"
    `${maximizedLocale.language!}-${maximizedLocale.script!}`,
    // "zh" / "pt"
    maximizedLocale.language!,
  ];
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
}): Promise<CodeTranslations> {
  const localesToTry = codeTranslationLocalesToTry(locale);

  // Return the content of the first file that match
  // fr_FR.json => fr.json => nothing
  for (const localeToTry of localesToTry) {
    const filePath = path.resolve(dirPath, localeToTry, `${name}.json`);

    if (await pathExists(filePath)) {
      return readJSON(filePath) as Promise<CodeTranslations>;
    }
  }

  return {};
}
