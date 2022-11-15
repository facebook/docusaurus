/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 *
 * @param {string} value
 * @returns {boolean|number}
 */
export function normalizePollValue(value) {
  if (value === undefined || value === '') {
    return false;
  }

  const parsedIntValue = Number.parseInt(value, 10);
  if (!Number.isNaN(parsedIntValue)) {
    return parsedIntValue;
  }

  return value === 'true';
}
