/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default (function() {
  if (!window || !CustomEvent || !window.dispatchEvent) {
    return null;
  }

  return {
    onRouteUpdate() {
      window.dispatchEvent(new CustomEvent('onRouteUpdate'));
    },
  };
})();
