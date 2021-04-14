/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const codeBlockTitleRegex = /title=(["'])(.*?)\1/;

export function parseCodeBlockTitle(metastring?: string): string {
  return metastring?.match(codeBlockTitleRegex)?.[2] ?? '';
}
