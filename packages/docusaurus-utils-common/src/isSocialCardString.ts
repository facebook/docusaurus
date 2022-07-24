/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type {SocialCardService} from '@docusaurus/types/src/config';

export function isSocialCardString(
  socialCardService: SocialCardService,
): socialCardService is string {
  return typeof socialCardService === 'string';
}
