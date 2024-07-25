/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {checkAuthorsMapPermalinkCollisions} from '../authorsMap';
import type {AuthorsMap} from '@docusaurus/plugin-content-blog';

describe('checkAuthorsMapPermalinkCollisions', () => {
  it('do not throw when permalinks are unique', () => {
    const authors: AuthorsMap = {
      author1: {
        name: 'author1',
        key: 'author1',
        page: {
          permalink: '/author1',
        },
      },
      author2: {
        name: 'author2',
        key: 'author2',
        page: {
          permalink: '/author2',
        },
      },
    };

    expect(() => {
      checkAuthorsMapPermalinkCollisions(authors);
    }).not.toThrow();
  });

  it('throw when permalinks collide', () => {
    const authors: AuthorsMap = {
      author1: {
        name: 'author1',
        key: 'author1',
        page: {
          permalink: '/author1',
        },
      },
      author2: {
        name: 'author1',
        key: 'author1',
        page: {
          permalink: '/author1',
        },
      },
    };

    expect(() => {
      checkAuthorsMapPermalinkCollisions(authors);
    }).toThrowErrorMatchingInlineSnapshot(`
      "The following permalinks are duplicated:
      Permalink: /author1
      Authors: author1, author1"
    `);
  });
});
