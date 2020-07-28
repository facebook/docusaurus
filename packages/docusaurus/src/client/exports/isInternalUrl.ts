/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function hasProtocol(url: string) {
  return /^(\w*:|\/\/)/.test(url) === true;
}

export default function isInternalUrl(url?: string): boolean {
  return typeof url !== 'undefined' && !hasProtocol(url);
}
