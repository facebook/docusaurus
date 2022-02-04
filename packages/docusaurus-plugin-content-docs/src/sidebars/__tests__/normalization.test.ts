/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizeSidebars} from '../normalization';

describe('normalization', () => {
  test('normalizes shorthands', () => {
    expect(
      normalizeSidebars({
        sidebar: {
          Category: ['doc1', 'doc2'],
          'Category 2': {
            'Subcategory 1': ['doc3', 'doc4'],
            'Subcategory 2': ['doc5', 'doc6'],
          },
        },
      }),
    ).toMatchSnapshot();

    expect(
      normalizeSidebars({
        sidebar: [
          {
            type: 'link',
            label: 'Google',
            href: 'https://google.com',
          },
          {
            'Category 1': ['doc1', 'doc2'],
            'Category 2': ['doc3', 'doc4'],
          },
        ],
      }),
    ).toMatchSnapshot();
  });
});
