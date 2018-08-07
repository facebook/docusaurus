/**
 * Copyright (c) 2017-present, Facebook, Inc.
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
  test('minify css', () => {
    const testCss = fs.readFileSync(
      path.join(__dirname, '__fixtures__', 'test.css'),
      'utf8'
    );
    const notCss = fs.readFileSync(
      path.join(__dirname, '__fixtures__', 'test.md'),
      'utf8'
    );
    utils.minifyCss(testCss).then(css => expect(css).toMatchSnapshot());
    utils.minifyCss(notCss).catch(e => expect(e).toMatchSnapshot());
  });

  test('autoprefix css', () => {
    const testCss = fs.readFileSync(
      path.join(__dirname, '__fixtures__', 'test.css'),
      'utf8'
    );

    utils.autoPrefixCss(testCss).then(css => expect(css).toMatchSnapshot());
  });

  test('getLanguage', () => {
    const testDocEnglish = path.join('translated_docs', 'en', 'test.md');
    const testDocJapanese = path.join('translated_docs', 'ja', 'test.md');
    const testDocJapaneseInSubfolder = path.join(
      'translated_docs',
      'ja',
      'en',
      'test.md'
    );
    const testDocInSubfolder = path.join('docs', 'ro', 'test.md');
    const testDocNoLanguage = path.join('docs', 'test.md');
    expect(utils.getLanguage(testDocEnglish, 'translated_docs')).toBe('en');
    expect(utils.getLanguage(testDocJapanese, 'translated_docs')).toBe('ja');
    expect(
      utils.getLanguage(testDocJapaneseInSubfolder, 'translated_docs')
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

  describe('validateSidebar', () => {
    test('should throw an error for invalid pages', () => {
      const metadata = {
        id: 'doc1',
        sidebar: 'docs',
        next_id: 'doc2',
        next: 'doc2',
      };

      const pages = {
        doc1: {},
      };

      expect(() => {
        utils.validateSidebar(metadata, pages);
      }).toThrow(
        `Improper sidebars.json file, document with id 'doc2' not found. Make sure that documents with the ids specified in sidebars.json exist and that no ids are repeated.`
      );
    });

    test('should throw an error for invalid version pages', () => {
      const metadata = {
        id: 'doc1',
        version: 'foo',
        sidebar: 'docs',
        next_id: 'doc2',
        next: 'doc2',
      };

      const pages = {
        doc1: {},
      };

      expect(() => {
        utils.validateSidebar(metadata, pages);
      }).toThrow(
        `Improper sidebars file for version foo, document with id 'doc2' not found. Make sure that all documents with ids specified in this version's sidebar file exist and that no ids are repeated.`
      );
    });

    test('should pass validate', () => {
      const metadata = {
        id: 'doc1',
        sidebar: 'docs',
        next_id: 'doc2',
        next: 'doc2',
      };

      const pages = {
        doc1: {},
        doc2: {},
      };

      expect(() => {
        utils.validateSidebar(metadata, pages);
      }).not.toThrow();
    });
  });
});
