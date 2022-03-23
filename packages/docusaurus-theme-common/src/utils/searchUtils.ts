/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const DEFAULT_SEARCH_TAG = 'default';

/** The search tag to append as each doc's metadata. */
export function docVersionSearchTag(
  pluginId: string,
  versionName: string,
): string {
  return `docs-${pluginId}-${versionName}`;
}
