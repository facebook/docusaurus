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
 * @param comparator Compares two values and returns `true` if they are equal
 * (duplicated).
 * @returns Value of the elements `v` that have a preceding element `u` where
 * `comparator(u, v) === true`. Values within the returned array are not
 * guaranteed to be unique.
 */
export function duplicates<T>(
  arr: readonly T[],
  comparator: (a: T, b: T) => boolean = (a, b) => a === b,
): T[] {
  return arr.filter(
    (v, vIndex) => arr.findIndex((u) => comparator(u, v)) !== vIndex,
  );
}

/**
 * Remove duplicate array items (similar to `_.uniq`)
 * @param arr The array.
 * @returns An array with duplicate elements removed by reference comparison.
 */
export function uniq<T>(arr: T[]): T[] {
  // Note: had problems with [...new Set()]: https://github.com/facebook/docusaurus/issues/4972#issuecomment-863895061
  return Array.from(new Set(arr));
}

/**
 * Groups items by key, using the native `Object.groupBy()`.
 * @returns A null-prototype object mapping each key to its items.
 */
export function groupBy<K extends PropertyKey, T>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K,
): Partial<Record<K, T[]>> {
  return Object.groupBy(items, keySelector);
}
