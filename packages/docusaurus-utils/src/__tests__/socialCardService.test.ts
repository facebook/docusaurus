/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DEFAULT_CONFIG} from '@docusaurus/core/src/server/configValidation';
import {getSocialCardUrl, isSocialCardString} from '../socialCardService';

describe('isSocialCardString', () => {
  it('correctly identifies social card service url generator', () => {
    expect(
      isSocialCardString({
        getUrl: () => 'a social card service url',
        options: {},
      }),
    ).toBe(false);
  });

  it('correctly identifies social card string', () => {
    expect(isSocialCardString('a social card url')).toBe(true);
  });
});

describe('getSocialCardUrl', () => {
  it('calls getUrl when social card service url generator provided', () => {
    expect(
      getSocialCardUrl(DEFAULT_CONFIG.socialCardService, {
        type: 'docs',
        title: 'test',
        permalink: 'a permalink',
      }),
    ).toBe(`https://docusaurus-og-image.vercel.app/${encodeURI('test')}?`);
  });

  it('returns url if social card service is a url string', () => {
    expect(getSocialCardUrl('test url')).toBe('test url');
  });
});
