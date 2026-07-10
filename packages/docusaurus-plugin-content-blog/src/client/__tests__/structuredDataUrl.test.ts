/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {getAbsoluteUrl} from '../structuredDataUrl';
import type {DocusaurusConfig} from '@docusaurus/types';

function siteConfig(
  config: Partial<DocusaurusConfig>,
): DocusaurusConfig {
  return {
    url: 'https://docusaurus.io',
    baseUrl: '/',
    ...config,
  } as DocusaurusConfig;
}

describe('getAbsoluteUrl', () => {
  const permalink = '/blog/my-post';

  it('adds a trailing slash when trailingSlash is true', () => {
    expect(
      getAbsoluteUrl(permalink, siteConfig({trailingSlash: true})),
    ).toBe('https://docusaurus.io/blog/my-post/');
  });

  it('removes the trailing slash when trailingSlash is false', () => {
    expect(
      getAbsoluteUrl(`${permalink}/`, siteConfig({trailingSlash: false})),
    ).toBe('https://docusaurus.io/blog/my-post');
  });

  it('leaves the permalink untouched when trailingSlash is undefined', () => {
    expect(
      getAbsoluteUrl(permalink, siteConfig({trailingSlash: undefined})),
    ).toBe('https://docusaurus.io/blog/my-post');
  });
});
