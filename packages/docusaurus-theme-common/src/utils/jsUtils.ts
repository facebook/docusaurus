/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// A replacement of lodash in client code

/**
 * Gets the duplicate values in an array.
 * @param arr The array.
 * @param comparator Compares two values and returns `true` if they are equal (duplicated).
 * @returns Value of the elements `v` that have a preceding element `u` where `comparator(u, v) === true`. Values within the returned array are not guaranteed to be unique.
 */
export function duplicates<T>(
  arr: readonly T[],
  comparator: (a: T, b: T) => boolean = (a, b) => a === b,
): T[] {
  return arr.filter(
    (v, vIndex) => arr.findIndex((u) => comparator(u, v)) !== vIndex,
  );
}
