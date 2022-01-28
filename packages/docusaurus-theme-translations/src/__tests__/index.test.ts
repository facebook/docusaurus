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
} from '../index';

describe('codeTranslationLocalesToTry', () => {
  test('should return appropriate locale lists', () => {
    expect(codeTranslationLocalesToTry('fr')).toEqual([
      'fr',
      'fr-FR',
      'fr-Latn',
    ]);
    expect(codeTranslationLocalesToTry('fr-FR')).toEqual(['fr-FR', 'fr']);
    // Note: "pt" is expanded into "pt-BR", not "pt-PT", as "pt-BR" is more widely used!
    // See https://github.com/facebook/docusaurus/pull/4536#issuecomment-810088783
    expect(codeTranslationLocalesToTry('pt')).toEqual([
      'pt',
      'pt-BR',
      'pt-Latn',
    ]);
    expect(codeTranslationLocalesToTry('pt-BR')).toEqual(['pt-BR', 'pt']);
    expect(codeTranslationLocalesToTry('pt-PT')).toEqual(['pt-PT', 'pt']);
    expect(codeTranslationLocalesToTry('zh')).toEqual([
      'zh',
      'zh-CN',
      'zh-Hans',
    ]);
  });
});

describe('readDefaultCodeTranslationMessages', () => {
  const dirPath = path.resolve(
    __dirname,
    '__fixtures__',
    'defaultCodeTranslations',
  );
  const name = 'default';

  async function readAsJSON(locale: string, filename: string = name) {
    console.log(path.resolve(dirPath, locale, `${filename}.json`));

    return JSON.parse(
      await fs.readFile(
        path.resolve(dirPath, locale, `${filename}.json`),
        'utf8',
      ),
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
        name,
      }),
    ).resolves.toEqual({});
  });

  test('for fr but bad folder', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'fr',
        dirPath: __dirname,
        name,
      }),
    ).resolves.toEqual({});
  });

  test('for fr', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'fr',
        dirPath,
        name,
      }),
    ).resolves.toEqual(await readAsJSON('fr'));
  });

  test('for fr-FR', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'fr-FR',
        dirPath,
        name,
      }),
    ).resolves.toEqual(await readAsJSON('fr-FR'));
  });

  test('for en', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'en',
        dirPath,
        name,
      }),
    ).resolves.toEqual(await readAsJSON('en'));
  });

  test('for en-US', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'en-US',
        dirPath,
        name,
      }),
    ).resolves.toEqual(await readAsJSON('en'));
  });

  test('for en-WHATEVER', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'en-WHATEVER',
        dirPath,
        name,
      }),
    ).resolves.toEqual(await readAsJSON('en'));
  });

  test('default locale', async () => {
    await expect(
      readDefaultCodeTranslationMessages({
        locale: 'zh',
        name: 'plugin-pwa',
      }),
    ).resolves.toEqual({
      'theme.PwaReloadPopup.closeButtonAriaLabel': '关闭',
      'theme.PwaReloadPopup.info': '有可用的新版本',
      'theme.PwaReloadPopup.refreshButtonText': '刷新',
    });
  });
});
