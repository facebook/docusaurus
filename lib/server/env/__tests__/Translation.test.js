/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const Translation = require('../Translation');

let translation;

beforeEach(() => {
  translation = new Translation();
  translation.enabled = true;
  translation.languages = [
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
  ];
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

  expect(translation.getLanguage(testDocEnglish, 'translated_docs')).toBe('en');
  expect(translation.getLanguage(testDocJapanese, 'translated_docs')).toBe(
    'ja'
  );
  expect(
    translation.getLanguage(testDocJapaneseInSubfolder, 'translated_docs')
  ).toBe('ja');
  expect(translation.getLanguage(testDocInSubfolder, 'docs')).toBeNull();
  expect(translation.getLanguage(testDocNoLanguage, 'docs')).toBeNull();
});
