/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Compare the 2 paths, ignoring trailing /
export const isSamePath = (path1, path2) => {
  const normalize = (str) => (str.endsWith('/') ? str : `${str}/`);
  return normalize(path1) === normalize(path2);
};
