/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {parseCodeBlockTitle} from '../codeBlockUtils';

describe('parseCodeBlockTitle', () => {
  test('should parse double quote delimited title', () => {
    expect(parseCodeBlockTitle(`title="index.js"`)).toEqual(`index.js`);
  });

  test('should parse single quote delimited title', () => {
    expect(parseCodeBlockTitle(`title='index.js'`)).toEqual(`index.js`);
  });

  test('should not parse mismatched quote delimiters', () => {
    expect(parseCodeBlockTitle(`title="index.js'`)).toEqual(``);
  });

  test('should parse undefined metastring', () => {
    expect(parseCodeBlockTitle(undefined)).toEqual(``);
  });

  test('should parse metastring with no title specified', () => {
    expect(parseCodeBlockTitle(`{1,2-3}`)).toEqual(``);
  });

  test('should parse with multiple metadatas title first', () => {
    expect(parseCodeBlockTitle(`title="index.js" label="JavaScript"`)).toEqual(
      `index.js`,
    );
  });

  test('should parse with multiple metadatas title last', () => {
    expect(parseCodeBlockTitle(`label="JavaScript" title="index.js"`)).toEqual(
      `index.js`,
    );
  });

  test('should parse double quotes when delimited by single quotes', () => {
    expect(parseCodeBlockTitle(`title='console.log("Hello, World!")'`)).toEqual(
      `console.log("Hello, World!")`,
    );
  });

  test('should parse single quotes when delimited by double quotes', () => {
    expect(parseCodeBlockTitle(`title="console.log('Hello, World!')"`)).toEqual(
      `console.log('Hello, World!')`,
    );
  });
});
