/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import parseCodeBlockTitle from '../parseCodeBlockTitle';

const metastringSamples = {
  doubleQuote: {
    input: `title="index.js"`,
    expectedOutput: `index.js`,
  },
  singleQuote: {
    input: `title='index.js'`,
    expectedOutput: `index.js`,
  },
  mismatchedQuotes: {
    input: `title="index.js'`,
    expectedOutput: ``,
  },
  undefinedMetastring: {
    input: undefined,
    expectedOutput: ``,
  },
  noTitle: {
    input: `{1,2-3}`,
    expectedOutput: '',
  },
  otherMetadata: {
    input: `title="index.js" label="JavaScript"`,
    expectedOutput: `index.js`,
  },
  titleWithDoubleQuotes: {
    input: `title='console.log("Hello, World!")'`,
    expectedOutput: `console.log("Hello, World!")`,
  },
  titleWithSingleQuotes: {
    input: `title="console.log('Hello, World!')"`,
    expectedOutput: `console.log('Hello, World!')`,
  },
};

describe('parseCodeBlockTitle', () => {
  test('sholud parse double quote delimited title', () => {
    const sample = metastringSamples.doubleQuote;
    const result = parseCodeBlockTitle(sample.input);
    expect(result).toEqual(sample.expectedOutput);
  });

  test('should parse single quote delimited title', () => {
    const sample = metastringSamples.singleQuote;
    const result = parseCodeBlockTitle(sample.input);
    expect(result).toEqual(sample.expectedOutput);
  });

  test('should not parse mismatched quote delimiters', () => {
    const sample = metastringSamples.mismatchedQuotes;
    const result = parseCodeBlockTitle(sample.input);
    expect(result).toEqual(sample.expectedOutput);
  });

  test('should parse undefined metastring', () => {
    const sample = metastringSamples.undefinedMetastring;
    const result = parseCodeBlockTitle(sample.input);
    expect(result).toEqual(sample.expectedOutput);
  });

  test('should parse metastring with no title specified', () => {
    const sample = metastringSamples.noTitle;
    const result = parseCodeBlockTitle(sample.input);
    expect(result).toEqual(sample.expectedOutput);
  });

  test('should parse only up to first matching delimiter', () => {
    const sample = metastringSamples.otherMetadata;
    const result = parseCodeBlockTitle(sample.input);
    expect(result).toEqual(sample.expectedOutput);
  });

  test('should parse double quotes when delimited by single quotes', () => {
    const sample = metastringSamples.titleWithDoubleQuotes;
    const result = parseCodeBlockTitle(sample.input);
    expect(result).toEqual(sample.expectedOutput);
  });

  test('should parse single quotes when delimited by double quotes', () => {
    const sample = metastringSamples.titleWithSingleQuotes;
    const result = parseCodeBlockTitle(sample.input);
    expect(result).toEqual(sample.expectedOutput);
  });
});
