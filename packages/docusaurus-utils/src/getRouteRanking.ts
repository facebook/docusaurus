/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Each segment gets 4 points
 * |  Rank  | Path           |
 * |------- |----------------|
 * |  5     |   /            |
 * |  7     | /groups        |
 * |  14    | /groups/mine   |
 * |  21    | /groups/mine/users  |
 */
export function getRouteRanking(routePath: string): number {
  const parts = routePath.split('/').filter((v) => v !== '');
  let ranking = parts.length > 0 ? parts.length * 4 : 5;
  for (let i = 0; i < parts.length; i += 1) {
    ranking += 3;
  }

  return ranking;
}
