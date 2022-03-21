/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Compare the 2 paths, case insensitive and ignoring trailing slash
export const isSamePath = (
  path1: string | undefined,
  path2: string | undefined,
): boolean => {
  const normalize = (pathname: string | undefined) =>
    (!pathname || pathname?.endsWith('/')
      ? pathname
      : `${pathname}/`
    )?.toLowerCase();
  return normalize(path1) === normalize(path2);
};
