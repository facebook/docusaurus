/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  fromExtensionsRedirectCreator,
  toExtensionsRedirectCreator,
} from '../redirectCreators';
import {RedirectsCreator} from '../types';

const createExtensionValidationTests = (
  redirectCreatorFactory: (extensions: string[]) => RedirectsCreator,
) => {
  test('should reject empty extensions', () => {
    expect(() => {
      redirectCreatorFactory(['.html']);
    }).toThrowErrorMatchingInlineSnapshot(
      `"Extension=['.html'] contains a . (dot) and is not allowed. If the redirect extension system is not good enough for your usecase, you can create redirects yourself with the 'createRedirects' plugin option."`,
    );
  });
  test('should reject extensions with .', () => {
    expect(() => {
      redirectCreatorFactory(['.html']);
    }).toThrowErrorMatchingInlineSnapshot(
      `"Extension=['.html'] contains a . (dot) and is not allowed. If the redirect extension system is not good enough for your usecase, you can create redirects yourself with the 'createRedirects' plugin option."`,
    );
  });
  test('should reject extensions with /', () => {
    expect(() => {
      redirectCreatorFactory(['ht/ml']);
    }).toThrowErrorMatchingInlineSnapshot(
      `"Extension=['ht/ml'] contains a / and is not allowed. If the redirect extension system is not good enough for your usecase, you can create redirects yourself with the 'createRedirects' plugin option."`,
    );
  });
  test('should reject extensions with illegal url char', () => {
    expect(() => {
      redirectCreatorFactory([',']);
    }).toThrowErrorMatchingInlineSnapshot(
      `"Extension=[','] contains invalid uri characters. If the redirect extension system is not good enough for your usecase, you can create redirects yourself with the 'createRedirects' plugin option."`,
    );
  });
};

describe('fromExtensionsRedirectCreator', () => {
  createExtensionValidationTests(fromExtensionsRedirectCreator);

  test('should create redirects from html/htm extensions', () => {
    const redirectCreator = fromExtensionsRedirectCreator(['html', 'htm']);
    expect(redirectCreator('')).toEqual([]);
    expect(redirectCreator('/')).toEqual([]);
    expect(redirectCreator('/abc.html')).toEqual(['/abc']);
    expect(redirectCreator('/abc.htm')).toEqual(['/abc']);
    expect(redirectCreator('/abc.xyz')).toEqual([]);
  });

  test('should not create redirection for an empty extension array', () => {
    const redirectCreator = fromExtensionsRedirectCreator([]);
    expect(redirectCreator('')).toEqual([]);
    expect(redirectCreator('/')).toEqual([]);
    expect(redirectCreator('/abc.html')).toEqual([]);
  });
});

describe('toExtensionsRedirectCreator', () => {
  createExtensionValidationTests(toExtensionsRedirectCreator);

  test('should create redirects to html/htm extensions', () => {
    const redirectCreator = toExtensionsRedirectCreator(['html', 'htm']);
    expect(redirectCreator('')).toEqual([]);
    expect(redirectCreator('/')).toEqual([]);
    expect(redirectCreator('/abc')).toEqual(['/abc.html', '/abc.htm']);
    expect(redirectCreator('/def.html')).toEqual([]);
    expect(redirectCreator('/def/')).toEqual([]);
  });

  test('should not create redirection for an empty extension array', () => {
    const redirectCreator = toExtensionsRedirectCreator([]);
    expect(redirectCreator('')).toEqual([]);
    expect(redirectCreator('/')).toEqual([]);
    expect(redirectCreator('/abc')).toEqual([]);
    expect(redirectCreator('/def.html')).toEqual([]);
    expect(redirectCreator('/def/')).toEqual([]);
  });
});
