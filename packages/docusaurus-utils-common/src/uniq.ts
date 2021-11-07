/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Remove duplicate array items (similar to _.uniq)
export default function uniq<T>(array: T[]): T[] {
  // Note: had problems with [...new Set()]: https://github.com/facebook/docusaurus/issues/4972#issuecomment-863895061
  return Array.from(new Set(array));
}
