/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getFormat} from '../format';

describe('getFormat', () => {
  it('uses frontMatter format over anything else', () => {
    expect(getFormat({frontMatterFormat: 'md', filePath: 'xyz.md'})).toBe('md');
    expect(getFormat({frontMatterFormat: 'md', filePath: 'xyz.mdx'})).toBe(
      'md',
    );
    expect(getFormat({frontMatterFormat: 'mdx', filePath: 'xyz.md'})).toBe(
      'mdx',
    );
    expect(getFormat({frontMatterFormat: 'mdx', filePath: 'xyz.mdx'})).toBe(
      'mdx',
    );
  });

  it('detects appropriate format from file extension', () => {
    expect(getFormat({frontMatterFormat: 'detect', filePath: 'xyz.md'})).toBe(
      'md',
    );
    expect(
      getFormat({frontMatterFormat: 'detect', filePath: 'xyz.markdown'}),
    ).toBe('md');

    expect(
      getFormat({frontMatterFormat: 'detect', filePath: 'folder/xyz.md'}),
    ).toBe('md');
    expect(
      getFormat({frontMatterFormat: 'detect', filePath: 'folder/xyz.markdown'}),
    ).toBe('md');
    expect(getFormat({frontMatterFormat: 'detect', filePath: 'xyz.mdx'})).toBe(
      'mdx',
    );
    expect(
      getFormat({frontMatterFormat: 'detect', filePath: 'folder/xyz.mdx'}),
    ).toBe('mdx');

    expect(
      getFormat({frontMatterFormat: 'detect', filePath: 'xyz.unknown'}),
    ).toBe('mdx');
    expect(
      getFormat({frontMatterFormat: 'detect', filePath: 'folder/xyz.unknown'}),
    ).toBe('mdx');
  });
});
