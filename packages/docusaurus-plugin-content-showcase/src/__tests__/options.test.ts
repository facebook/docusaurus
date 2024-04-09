/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {normalizePluginOptions} from '@docusaurus/utils-validation';
import {validateOptions, DEFAULT_OPTIONS} from '../options';
import type {Options} from '@docusaurus/plugin-content-showcase';

function testValidate(options: Options) {
  return validateOptions({validate: normalizePluginOptions, options});
}
const defaultOptions = {
  ...DEFAULT_OPTIONS,
  id: 'default',
};

// todo add test that validate and reject tags.yaml file

describe('normalizeShowcasePluginOptions', () => {
  it('returns default options for undefined user options', () => {
    expect(testValidate({})).toEqual(defaultOptions);
  });

  it('fills in default options for partially defined user options', () => {
    expect(testValidate({path: 'src/foo'})).toEqual({
      ...defaultOptions,
      path: 'src/foo',
    });
  });

  it('accepts correctly defined user options', () => {
    const userOptions = {
      path: 'src/showcase',
      routeBasePath: '/showcase',
      include: ['**/*.{yaml,yml}'],
      exclude: ['**/$*/'],
    };
    expect(testValidate(userOptions)).toEqual({
      ...defaultOptions,
      ...userOptions,
    });
  });

  it('rejects bad path inputs', () => {
    expect(() => {
      testValidate({
        // @ts-expect-error: bad attribute
        path: 42,
      });
    }).toThrowErrorMatchingInlineSnapshot(`""path" must be a string"`);
  });

  it('empty routeBasePath replace default path("/")', () => {
    expect(
      testValidate({
        routeBasePath: '',
      }),
    ).toEqual({
      ...defaultOptions,
      routeBasePath: '/',
    });
  });

  it('accepts correctly defined tags file options', () => {
    const userOptions = {
      tags: '@site/showcase/tags.yaml',
    };
    expect(testValidate(userOptions)).toEqual({
      ...defaultOptions,
      ...userOptions,
    });
  });

  it('reject badly defined tags file options', () => {
    const userOptions = {
      tags: 42,
    };
    expect(() =>
      testValidate(
        // @ts-expect-error: bad attributes
        userOptions,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `""tags" must be one of [string, object]"`,
    );
  });

  it('accepts correctly defined tags object options', () => {
    const userOptions = {
      tags: {
        favorite: {
          label: 'Favorite',
          description: {
            message:
              'Our favorite Docusaurus sites that you must absolutely check out!',
            id: 'showcase.tag.favorite.description',
          },
          color: '#e9669e',
        },
      },
    };
    expect(testValidate(userOptions)).toEqual({
      ...defaultOptions,
      ...userOptions,
    });
  });

  it('reject bedly defined tags object options', () => {
    const userOptions = {
      tags: {
        favorite: {
          label: 32,
          description: {
            message:
              'Our favorite Docusaurus sites that you must absolutely check out!',
            id: 'showcase.tag.favorite.description',
          },
          color: '#e9669e',
        },
      },
    };
    expect(() =>
      testValidate(
        // @ts-expect-error: bad attributes
        userOptions,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `""tags.favorite.label" must be a string"`,
    );
  });
});
