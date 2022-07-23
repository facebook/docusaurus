/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  DEFAULT_CONFIG,
  DEFAULT_SOCIAL_CARD_SERVICE_CONFIG,
} from '@docusaurus/core/src/server/configValidation';
import {getSocialCardUrl, isSocialCardString} from '../socialCardService';
import type {LoadContext} from '@docusaurus/types';

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
      getSocialCardUrl(
        {
          siteConfig: DEFAULT_CONFIG,
        } as unknown as LoadContext,
        {
          type: 'docs',
          title: 'test',
          permalink: 'a permalink',
        },
      ),
    ).toBe(
      `${
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options?.baseUrl
      }${encodeURIComponent(
        'test',
      )}?markdown=true&docusaurus=true&theme=light&`,
    );
  });

  it('returns url if social card service is a url string', () => {
    expect(
      getSocialCardUrl({
        siteConfig: {
          socialCardService: 'test url',
        },
      } as unknown as LoadContext),
    ).toBe('test url');
  });
});
