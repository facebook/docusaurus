/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  onRouteUpdate({previousLocation, location}) {
    console.log('commonjs onRouteUpdate', {previousLocation, location});
  },
  onRouteUpdateDelayed({location}) {
    console.log('commonjs onRouteUpdateDelayed', {location});
  },
};
