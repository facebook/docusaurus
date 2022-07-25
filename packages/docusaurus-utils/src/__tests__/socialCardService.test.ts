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
import {getSocialCardUrl} from '../socialCardService';
import type {LoadContext} from '@docusaurus/types';

describe('getSocialCardUrl', () => {
  it('calls function when social card service url generator provided', () => {
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

  it('addBaseUrl applied to projectLogo', () => {
    const path = 'img/some/local/path';
    expect(
      getSocialCardUrl(
        {
          siteConfig: {
            url: 'https://docusaurus.io',
            baseUrl: '/',
            socialCardService: {
              url: DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.url,
              options: {
                ...DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options,
                projectLogo: path,
              },
            },
          },
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
      }${encodeURIComponent('test')}?projectLogo=${encodeURIComponent(
        `https://docusaurus.io/${path}`,
      )}&markdown=true&docusaurus=true&theme=light&`,
    );
  });

  it('returns url if social card service url is a string', () => {
    expect(
      getSocialCardUrl({
        siteConfig: {
          socialCardService: {
            url: 'test url',
          },
        },
      } as unknown as LoadContext),
    ).toBe('test url');
  });
});
