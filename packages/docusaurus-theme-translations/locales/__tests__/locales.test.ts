/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import path from 'node:path';
import fs from 'node:fs/promises';
import _ from 'lodash';
import {readJSON} from '@docusaurus/fs';
import {extractThemeCodeMessages} from '../../src/utils';

describe('theme translations', () => {
  it('has base messages files contain EXACTLY all the translations extracted from the theme. Please run "pnpm --filter @docusaurus/theme-translations update" to keep base messages files up-to-date', async () => {
    const baseMessagesDirPath = path.join(__dirname, '../base');
    const baseMessages = await fs
      .readdir(baseMessagesDirPath)
      .then((files) =>
        Promise.all(
          files.map(
            (baseMessagesFile) =>
              readJSON(
                path.join(baseMessagesDirPath, baseMessagesFile),
              ) as Promise<{[key: string]: string}>,
          ),
        ),
      )
      .then((translations) =>
        Object.fromEntries(
          translations
            .map(Object.entries)
            .flat()
            .filter(([key]) => !key.endsWith('___DESCRIPTION')),
        ),
      );
    const codeMessages = _.mapValues(
      await extractThemeCodeMessages(),
      (translation) => translation.message,
    );

    expect(codeMessages).toEqual(baseMessages);
  });

  it('has localized messages files contain only messages of the base messages files. Please delete the unknown localized messages', async () => {
    const unknownMessages = await getUnknownLocalizedMessages();
    expect(unknownMessages).toEqual([]);
  });
});

const LocalesDirPath = path.join(__dirname, '..');

// Returns the "<locale>/<file>: <key>" localized messages not in base files
async function getUnknownLocalizedMessages(): Promise<string[]> {
  const baseFiles = await fs.readdir(path.join(LocalesDirPath, 'base'));
  const locales = (await fs.readdir(LocalesDirPath)).filter(
    (dirName) => dirName !== 'base' && !dirName.startsWith('__'),
  );

  const unknownMessages = await Promise.all(
    locales.flatMap((locale) =>
      baseFiles.map(async (file) => {
        const baseKeys = await readMessageKeys(path.join('base', file));
        const localeKeys = await readMessageKeys(path.join(locale, file));
        return _.difference(localeKeys, baseKeys).map(
          (key) => `${locale}/${file}: ${key}`,
        );
      }),
    ),
  );
  return unknownMessages.flat();
}

async function readMessageKeys(localeFilePath: string): Promise<string[]> {
  const messages = (await readJSON(
    path.join(LocalesDirPath, localeFilePath),
  )) as {[key: string]: string};
  return Object.keys(messages);
}
