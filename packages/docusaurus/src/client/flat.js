/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function flat(target) {
  const delimiter = '.';
  const output = {};

  function step(object, prev) {
    Object.keys(object).forEach((key) => {
      const value = object[key];
      const type = typeof value;
      const isObject = type === 'object' && !!value;
      const newKey = prev ? prev + delimiter + key : key;

      if (isObject && Object.keys(value).length) {
        step(value, newKey);
        return;
      }
      output[newKey] = value;
    });
  }

  step(target);
  return output;
}

export default flat;
