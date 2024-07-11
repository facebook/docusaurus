/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizeUrl} from '@docusaurus/utils';
import type {
  AuthorSocials,
  SocialPlatformKey,
} from '@docusaurus/plugin-content-blog';

const socialPlatforms: Record<SocialPlatformKey, string> = {
  twitter: 'https://twitter.com/',
  github: 'https://github.com/',
  linkedin: 'https://www.linkedin.com/',
  stackoverflow: 'https://stackoverflow.com/',
  x: 'https://x.com/',
};

const SocialPlatformKeys = Object.keys(socialPlatforms) as SocialPlatformKey[];

export const normalizeSocials = (value: AuthorSocials): AuthorSocials => {
  SocialPlatformKeys.forEach((platform) => {
    if (
      value[platform] &&
      !value[platform]!.startsWith(socialPlatforms[platform])
    ) {
      value[platform] = normalizeUrl([
        socialPlatforms[platform],
        value[platform]!,
      ]);
    }
  });

  return value;
};
