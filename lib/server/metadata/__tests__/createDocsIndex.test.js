/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const createDocsIndex = require('../createDocsIndex');

it('should populate docs index from multiple sidebars', () => {
  const result = createDocsIndex({
    docs: {
      Category1: ['doc1', 'doc2'],
      Category2: ['doc3', 'doc4'],
    },
    otherDocs: {
      Category1: ['doc5'],
    },
  });

  expect(result).toMatchSnapshot();
});

it('should resolve docs from older versions', () => {
  const result = createDocsIndex({
    docs: {
      Category1: ['doc1'],
    },
    'version-1.2.3-docs': {
      Category1: ['version-1.2.3-doc2'],
      Category2: ['version-1.2.3-doc1'],
    },
  });

  expect(result).toMatchSnapshot();
});

it('should resolve links to other sidebar docs', () => {
  const result = createDocsIndex({
    docs: {
      Category1: ['doc1'],
    },
    docs2: {
      Category1: ['docs.doc1', 'doc2'],
    },
  });

  console.warn(result);
});
