/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizeUrl} from '@docusaurus/utils';
import type {
  AuthorSocials,
  SocialPlatform,
} from '@docusaurus/plugin-content-blog';

const socialPlatforms: Record<SocialPlatform, string> = {
  twitter: 'https://twitter.com/',
  github: 'https://github.com/',
  linkedin: 'https://www.linkedin.com/',
  stackoverflow: 'https://stackoverflow.com/',
  x: 'https://x.com/',
};

export const normalizeSocials = (value: AuthorSocials): AuthorSocials => {
  (Object.keys(socialPlatforms) as SocialPlatform[]).forEach((platform) => {
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
