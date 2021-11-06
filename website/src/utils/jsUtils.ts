/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Inspired by https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_difference
export function difference<T>(...arrays: T[][]): T[] {
  return arrays.reduce((a, b) => a.filter((c) => !b.includes(c)));
}

// Inspired by https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_sortby-and-_orderby
export function sortBy<T>(array: T[], getter: (item: T) => unknown): T[] {
  const sortedArray = [...array];
  // eslint-disable-next-line no-nested-ternary
  sortedArray.sort((a, b) =>
    getter(a) > getter(b) ? 1 : getter(b) > getter(a) ? -1 : 0,
  );
  return sortedArray;
}

export function toggleListItem<T>(list: T[], item: T): T[] {
  const itemIndex = list.indexOf(item);
  if (itemIndex === -1) {
    return list.concat(item);
  } else {
    const newList = [...list];
    newList.splice(itemIndex, 1);
    return newList;
  }
}
