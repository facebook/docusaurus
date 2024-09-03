/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';

import type {
  AuthorSocials,
  SocialPlatformKey,
} from '@docusaurus/plugin-content-blog';

export const AuthorSocialsSchema = Joi.object<AuthorSocials>({
  twitter: Joi.string(),
  github: Joi.string(),
  linkedin: Joi.string(),
  // StackOverflow userIds like '82609' are parsed as numbers by Yaml
  stackoverflow: Joi.alternatives()
    .try(Joi.number(), Joi.string())
    .custom((val) => String(val)),
  x: Joi.string(),
}).unknown();

type PredefinedPlatformNormalizer = (value: string) => string;

const PredefinedPlatformNormalizers: Record<
  SocialPlatformKey | string,
  PredefinedPlatformNormalizer
> = {
  x: (handle: string) => `https://x.com/${handle}`,
  twitter: (handle: string) => `https://twitter.com/${handle}`,
  github: (handle: string) => `https://github.com/${handle}`,
  linkedin: (handle: string) => `https://www.linkedin.com/in/${handle}/`,
  stackoverflow: (userId: string) =>
    `https://stackoverflow.com/users/${userId}`,
};

type SocialEntry = [string, string];

function normalizeSocialEntry([platform, value]: SocialEntry): SocialEntry {
  const normalizer = PredefinedPlatformNormalizers[platform.toLowerCase()];
  if (typeof value !== 'string') {
    throw new Error(
      `Author socials should be usernames/userIds/handles, or fully qualified HTTP(s) absolute URLs.
Social platform '${platform}' has illegal value '${value}'`,
    );
  }
  const isAbsoluteUrl =
    value.startsWith('http://') || value.startsWith('https://');
  if (isAbsoluteUrl) {
    return [platform, value];
  } else if (value.includes('/')) {
    throw new Error(
      `Author socials should be usernames/userIds/handles, or fully qualified HTTP(s) absolute URLs.
Social platform '${platform}' has illegal value '${value}'`,
    );
  }
  if (normalizer && !isAbsoluteUrl) {
    const normalizedPlatform = platform.toLowerCase();
    const normalizedValue = normalizer(value);
    return [normalizedPlatform as SocialPlatformKey, normalizedValue];
  }
  return [platform, value];
}

export const normalizeSocials = (socials: AuthorSocials): AuthorSocials => {
  return Object.fromEntries(Object.entries(socials).map(normalizeSocialEntry));
};
