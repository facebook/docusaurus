/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const path = require('path');
const fs = require('fs');
const utils = require('../utils');

jest.mock('../env', () => ({
  translation: {
    enabled: true,
    enabledLanguages: () => [
      {
        enabled: true,
        name: 'English',
        tag: 'en',
      },
      {
        enabled: true,
        name: '日本語',
        tag: 'ja',
      },
    ],
  },
}));

describe('server utils', () => {
  test('minify css', async () => {
    const testCss = fs.readFileSync(
      path.join(__dirname, '__fixtures__', 'test.css'),
      'utf8',
    );
    const notCss = fs.readFileSync(
      path.join(__dirname, '__fixtures__', 'test.md'),
      'utf8',
    );
    const css = await utils.minifyCss(testCss);
    expect(css).toMatchSnapshot();

    await expect(utils.minifyCss(notCss)).rejects.toMatchSnapshot();
  });

  test('autoprefix css', async () => {
    const testCss = fs.readFileSync(
      path.join(__dirname, '__fixtures__', 'test.css'),
      'utf8',
    );

    const css = await utils.autoPrefixCss(testCss);
    expect(css).toMatchSnapshot();
  });

  test('getLanguage', () => {
    const testDocEnglish = path.join('translated_docs', 'en', 'test.md');
    const testDocJapanese = path.join('translated_docs', 'ja', 'test.md');
    const testDocJapaneseInSubfolder = path.join(
      'translated_docs',
      'ja',
      'en',
      'test.md',
    );
    const testDocInSubfolder = path.join('docs', 'ro', 'test.md');
    const testDocNoLanguage = path.join('docs', 'test.md');
    expect(utils.getLanguage(testDocEnglish, 'translated_docs')).toBe('en');
    expect(utils.getLanguage(testDocJapanese, 'translated_docs')).toBe('ja');
    expect(
      utils.getLanguage(testDocJapaneseInSubfolder, 'translated_docs'),
    ).toBe('ja');
    expect(utils.getLanguage(testDocInSubfolder, 'docs')).toBeNull();
    expect(utils.getLanguage(testDocNoLanguage, 'docs')).toBeNull();
  });

  test('getSubdir', () => {
    const docA = path.join('docs', 'endiliey', 'a.md');
    const docB = path.join('docs', 'nus', 'hackers', 'b.md');
    const docC = path.join('docs', 'c.md');
    const docD = path.join('website', 'translated_docs', 'wow', 'd.md');
    const docE = path.join('website', 'translated_docs', 'lol', 'lah', 'e.md');
    const docsDir = path.join('docs');
    const translatedDir = path.join('website', 'translated_docs');
    expect(utils.getSubDir(docA, docsDir)).toEqual('endiliey');
    expect(utils.getSubDir(docA, translatedDir)).toBeNull();
    expect(utils.getSubDir(docB, docsDir)).toEqual('nus/hackers');
    expect(utils.getSubDir(docB, translatedDir)).toBeNull();
    expect(utils.getSubDir(docC, docsDir)).toBeNull();
    expect(utils.getSubDir(docC, translatedDir)).toBeNull();
    expect(utils.getSubDir(docD, docsDir)).toBeNull();
    expect(utils.getSubDir(docD, translatedDir)).toEqual('wow');
    expect(utils.getSubDir(docE, docsDir)).toBeNull();
    expect(utils.getSubDir(docE, translatedDir)).toEqual('lol/lah');
  });

  describe('replaceAssetsLink', () => {
    test('verifies asset link is replaced after code block', () => {
      const content = '```Some block```\n![alt](assets/my.png) more text';
      const link = utils.replaceAssetsLink(content, 'thelocation');
      expect(link).toBe(
        '```Some block```\n![alt](thelocation/assets/my.png) more text',
      );
    });

    test('verifies asset link is not replaced inside a fenced code block', () => {
      const content = '```\n![alt](assets/my.png)\n```';
      const link = utils.replaceAssetsLink(content, 'thelocation');
      expect(link).toBe('```\n![alt](assets/my.png)\n```');
    });
  });
});
