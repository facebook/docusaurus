/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {ensureUniquePermalinks, normalizeTags} from '../../lib/tags';

describe('ensureUniquePermalinks', () => {
  it('throw when duplicate permalink found', () => {
    const definedTags = {
      open: {
        label: 'Open Source',
        permalink: '/custom-open-source',
        description: 'Learn about the open source',
      },
      closed: {
        label: 'Closed Source',
        permalink: '/custom-open-source',
        description: 'Learn about the closed source',
      },
      world: {
        label: 'World',
        permalink: '/world',
        description: 'Learn about the world',
      },
      world2: {
        label: 'World',
        permalink: '/world',
        description: 'Learn about the world',
      },
    };

    expect(() =>
      ensureUniquePermalinks(definedTags),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Duplicate permalinks found: /custom-open-source, /world"`,
    );
  });
});

describe('normalizeTags', () => {
  it('normalize null tag', () => {
    const input = {
      'kebab case test': null,
    };

    const expectedOutput = {
      'kebab case test': {
        description: 'kebab case test description',
        label: 'Kebab case test',
        permalink: '/kebab-case-test',
      },
    };

    expect(normalizeTags(input)).toEqual(expectedOutput);
  });

  it('normalize permalink and description', () => {
    const input = {
      world: {label: 'WORLD'},
    };

    const expectedOutput = {
      world: {
        description: 'world description',
        label: 'WORLD',
        permalink: '/world',
      },
    };

    expect(normalizeTags(input)).toEqual(expectedOutput);
  });

  it('normalize kebab case permalink and capitalize label', () => {
    const input = {
      'kebab case': null,
    };

    const expectedOutput = {
      'kebab case': {
        description: 'kebab case description',
        label: 'Kebab case',
        permalink: '/kebab-case',
      },
    };

    expect(normalizeTags(input)).toEqual(expectedOutput);
  });

  it('normalize test', () => {
    const input = {
      world: {permalink: 'aze'},
      hello: {permalink: 'h e l l o'},
    };

    const expectedOutput = {
      world: {
        description: 'world description',
        label: 'World',
        permalink: 'aze',
      },
      hello: {
        description: 'hello description',
        label: 'Hello',
        // TODO should we allow this ?
        permalink: 'h e l l o',
      },
    };

    expect(normalizeTags(input)).toEqual(expectedOutput);
  });
});
