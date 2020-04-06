/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function() {
  return {
    plugin: 'plugin-hello-world',
    getClientModules() {
      return ['hello', 'world'];
    },
  };
};
