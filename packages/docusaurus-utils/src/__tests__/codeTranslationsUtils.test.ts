/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from 'path';
import fs from 'fs-extra';
import {
  codeTranslationLocalesToTry,
  readDefaultCodeTranslationMessages,
} from '../codeTranslationsUtils';

describe('codeTranslationLocalesToTry', () => {
  test('should return appropriate locale lists', () => {
    expect(codeTranslationLocalesToTry('fr')).toEqual(['fr', 'fr-FR']);
    expect(codeTranslationLocalesToTry('fr-FR')).toEqual(['fr-FR', 'fr']);
    // Note: "pt" is expanded into "pt-BR", not "pt-PT", as "pt-BR" is more widely used!
    // See https://github.com/facebook/docusaurus/pull/4536#issuecomment-810088783
    expect(codeTranslationLocalesToTry('pt')).toEqual(['pt', 'pt-BR']);
    expect(codeTranslationLocalesToTry('pt-BR')).toEqual(['pt-BR', 'pt']);
    expect(codeTranslationLocalesToTry('pt-PT')).toEqual(['pt-PT', 'pt']);
  });
});

describe('readDefaultCodeTranslationMessages', () => {
  const dirPath = path.resolve(
    __dirname,
    '__fixtures__',
    'defaultCodeTranslations',
  );

  async function readAsJSON(filename: string) {
    return JSON.parse(
      await fs.readFile(path.resolve(dirPath, filename), 'utf8'),
    );
  }

  test('for empty locale', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: '',
        dirPath,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"First argument to Intl.Locale constructor can't be empty or missing"`,
    );
  });

  test('for unexisting locale', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'es',
        dirPath,
      }),
    ).resolves.toEqual({});
  });

  test('for fr but bad folder', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'fr',
        dirPath: __dirname,
      }),
    ).resolves.toEqual({});
  });

  test('for fr', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'fr',
        dirPath,
      }),
    ).resolves.toEqual(await readAsJSON('fr.json'));
  });

  test('for fr-FR', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'fr-FR',
        dirPath,
      }),
    ).resolves.toEqual(await readAsJSON('fr-FR.json'));
  });

  test('for en', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'en',
        dirPath,
      }),
    ).resolves.toEqual(await readAsJSON('en.json'));
  });

  test('for en-US', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'en-US',
        dirPath,
      }),
    ).resolves.toEqual(await readAsJSON('en.json'));
  });

  test('for en-WHATEVER', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'en-WHATEVER',
        dirPath,
      }),
    ).resolves.toEqual(await readAsJSON('en.json'));
  });
});
