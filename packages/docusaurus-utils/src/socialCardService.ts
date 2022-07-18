/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {LoadContext} from '@docusaurus/types';
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
  context: LoadContext,
  data?: SocialCardData,
): string {
  return isSocialCardString(context.siteConfig.socialCardService)
    ? context.siteConfig.socialCardService
    : context.siteConfig.socialCardService.getUrl(
        data ?? {
          type: 'default',
        },
        context.siteConfig.socialCardService.options,
      );
}
