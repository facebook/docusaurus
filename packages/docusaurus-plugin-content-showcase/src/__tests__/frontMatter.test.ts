/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {escapeRegexp} from '@docusaurus/utils';
import {validateShowcaseFrontMatter} from '../yaml';
import type {ShowcaseFrontMatter} from '@docusaurus/plugin-content-showcase';

function testField(params: {
  prefix: string;
  validFrontMatters: ShowcaseFrontMatter[];
  convertibleFrontMatter?: [
    ConvertibleFrontMatter: {[key: string]: unknown},
    ConvertedFrontMatter: ShowcaseFrontMatter,
  ][];
  invalidFrontMatters?: [
    InvalidFrontMatter: {[key: string]: unknown},
    ErrorMessage: string,
  ][];
}) {
  // eslint-disable-next-line jest/require-top-level-describe
  test(`[${params.prefix}] accept valid values`, () => {
    params.validFrontMatters.forEach((frontMatter) => {
      expect(validateShowcaseFrontMatter(frontMatter)).toEqual(frontMatter);
    });
  });

  // eslint-disable-next-line jest/require-top-level-describe
  test(`[${params.prefix}] convert valid values`, () => {
    params.convertibleFrontMatter?.forEach(
      ([convertibleFrontMatter, convertedFrontMatter]) => {
        expect(validateShowcaseFrontMatter(convertibleFrontMatter)).toEqual(
          convertedFrontMatter,
        );
      },
    );
  });

  // eslint-disable-next-line jest/require-top-level-describe
  test(`[${params.prefix}] throw error for values`, () => {
    params.invalidFrontMatters?.forEach(([frontMatter, message]) => {
      try {
        validateShowcaseFrontMatter(frontMatter);
        throw new Error(
          `Doc front matter is expected to be rejected, but was accepted successfully:\n ${JSON.stringify(
            frontMatter,
            null,
            2,
          )}`,
        );
      } catch (err) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect((err as Error).message).toMatch(
          new RegExp(escapeRegexp(message)),
        );
      }
    });
  });
}

describe('doc front matter schema', () => {
  it('accepts valid frontmatter', () => {
    const frontMatter: ShowcaseFrontMatter = {
      title: 'title',
      description: 'description',
      preview: 'preview',
      source: 'source',
      tags: [],
      website: 'website',
    };
    expect(validateShowcaseFrontMatter(frontMatter)).toEqual(frontMatter);
  });

  it('reject invalid frontmatter', () => {
    const frontMatter = {};
    expect(() =>
      validateShowcaseFrontMatter(frontMatter),
    ).toThrowErrorMatchingInlineSnapshot(
      `""title" is required. "description" is required. "preview" is required. "website" is required. "source" is required. "tags" is required"`,
    );
  });
});

describe('validateShowcaseFrontMatter full', () => {
  testField({
    prefix: 'valid full frontmatter',
    validFrontMatters: [
      {
        title: 'title',
        description: 'description',
        preview: 'preview',
        source: 'source',
        tags: [],
        website: 'website',
      },
    ],
  });
});
