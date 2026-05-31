/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getAbsoluteUrl} from './structuredDataUrl';

describe('getAbsoluteUrl', () => {
  const siteUrl = 'https://example.com';

  it('adds a trailing slash when trailingSlash is true', () => {
    expect(
      getAbsoluteUrl('/blog/my-post', {
        url: siteUrl,
        baseUrl: '/',
        trailingSlash: true,
      }),
    ).toBe('https://example.com/blog/my-post/');
  });

  it('removes a trailing slash when trailingSlash is false', () => {
    expect(
      getAbsoluteUrl('/blog/my-post/', {
        url: siteUrl,
        baseUrl: '/',
        trailingSlash: false,
      }),
    ).toBe('https://example.com/blog/my-post');
  });

  it('leaves the permalink untouched when trailingSlash is undefined', () => {
    expect(
      getAbsoluteUrl('/blog/my-post', {
        url: siteUrl,
        baseUrl: '/',
        trailingSlash: undefined,
      }),
    ).toBe('https://example.com/blog/my-post');
  });

  it('keeps the baseUrl trailing slash for the blog base path', () => {
    expect(
      getAbsoluteUrl('/myBase/', {
        url: siteUrl,
        baseUrl: '/myBase/',
        trailingSlash: false,
      }),
    ).toBe('https://example.com/myBase/');
  });
});
