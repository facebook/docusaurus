/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  createFromExtensionsRedirects,
  createToExtensionsRedirects,
} from '../extensionRedirects';
import {RedirectMetadata} from '../types';

const createExtensionValidationTests = (
  extensionRedirectCreatorFn: (
    paths: string[],
    extensions: string[],
  ) => RedirectMetadata[],
) => {
  test('should reject empty extensions', () => {
    expect(() => {
      extensionRedirectCreatorFn(['/'], ['.html']);
    }).toThrowErrorMatchingInlineSnapshot(
      `"Extension=['.html'] contains a . (dot) and is not allowed. If the redirect extension system is not good enough for your usecase, you can create redirects yourself with the 'createRedirects' plugin option."`,
    );
  });
  test('should reject extensions with .', () => {
    expect(() => {
      extensionRedirectCreatorFn(['/'], ['.html']);
    }).toThrowErrorMatchingInlineSnapshot(
      `"Extension=['.html'] contains a . (dot) and is not allowed. If the redirect extension system is not good enough for your usecase, you can create redirects yourself with the 'createRedirects' plugin option."`,
    );
  });
  test('should reject extensions with /', () => {
    expect(() => {
      extensionRedirectCreatorFn(['/'], ['ht/ml']);
    }).toThrowErrorMatchingInlineSnapshot(
      `"Extension=['ht/ml'] contains a / and is not allowed. If the redirect extension system is not good enough for your usecase, you can create redirects yourself with the 'createRedirects' plugin option."`,
    );
  });
  test('should reject extensions with illegal url char', () => {
    expect(() => {
      extensionRedirectCreatorFn(['/'], [',']);
    }).toThrowErrorMatchingInlineSnapshot(
      `"Extension=[','] contains invalid uri characters. If the redirect extension system is not good enough for your usecase, you can create redirects yourself with the 'createRedirects' plugin option."`,
    );
  });
};

describe('createToExtensionsRedirects', () => {
  createExtensionValidationTests(createToExtensionsRedirects);

  test('should create redirects from html/htm extensions', () => {
    const ext = ['html', 'htm'];
    expect(createToExtensionsRedirects([''], ext)).toEqual([]);
    expect(createToExtensionsRedirects(['/'], ext)).toEqual([]);
    expect(createToExtensionsRedirects(['/abc.html'], ext)).toEqual([
      {from: '/abc', to: '/abc.html'},
    ]);
    expect(createToExtensionsRedirects(['/abc.htm'], ext)).toEqual([
      {from: '/abc', to: '/abc.htm'},
    ]);
    expect(createToExtensionsRedirects(['/abc.xyz'], ext)).toEqual([]);
  });

  test('should create "to" redirects when relativeRoutesPath contains a prefix', () => {
    expect(
      createToExtensionsRedirects(['/prefix/file.html'], ['html']),
    ).toEqual([{from: '/prefix/file', to: '/prefix/file.html'}]);
  });

  test('should not create redirection for an empty extension array', () => {
    const ext: string[] = [];
    expect(createToExtensionsRedirects([''], ext)).toEqual([]);
    expect(createToExtensionsRedirects(['/'], ext)).toEqual([]);
    expect(createToExtensionsRedirects(['/abc.html'], ext)).toEqual([]);
  });
});

describe('createFromExtensionsRedirects', () => {
  createExtensionValidationTests(createFromExtensionsRedirects);

  test('should create redirects to html/htm extensions', () => {
    const ext = ['html', 'htm'];
    expect(createFromExtensionsRedirects([''], ext)).toEqual([]);
    expect(createFromExtensionsRedirects(['/'], ext)).toEqual([]);
    expect(createFromExtensionsRedirects(['/abc'], ext)).toEqual([
      {from: '/abc.html', to: '/abc'},
      {from: '/abc.htm', to: '/abc'},
    ]);
    expect(createFromExtensionsRedirects(['/def.html'], ext)).toEqual([]);
    expect(createFromExtensionsRedirects(['/def/'], ext)).toEqual([]);
  });

  test('should create "from" redirects when relativeRoutesPath contains a prefix', () => {
    expect(createFromExtensionsRedirects(['/prefix/file'], ['html'])).toEqual([
      {from: '/prefix/file.html', to: '/prefix/file'},
    ]);
  });

  test('should not create redirection for an empty extension array', () => {
    const ext: string[] = [];
    expect(createFromExtensionsRedirects([''], ext)).toEqual([]);
    expect(createFromExtensionsRedirects(['/'], ext)).toEqual([]);
    expect(createFromExtensionsRedirects(['/abc'], ext)).toEqual([]);
    expect(createFromExtensionsRedirects(['/def.html'], ext)).toEqual([]);
    expect(createFromExtensionsRedirects(['/def/'], ext)).toEqual([]);
  });
});
