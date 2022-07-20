/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  SocialCardData,
  SocialCardService,
} from '@docusaurus/types/src/config';

/** Determines whether socialCardService is a function that
 * generates url or a url string.
 */
export function isSocialCardString(
  socialCardService: SocialCardService,
): socialCardService is string {
  return typeof socialCardService === 'string';
}

export function getSocialCardUrl(
  socialCardService: SocialCardService,
  data?: SocialCardData,
): string {
  return isSocialCardString(socialCardService)
    ? socialCardService
    : socialCardService.getUrl(
        data ?? {
          type: 'default',
        },
        socialCardService.options,
      );
}
