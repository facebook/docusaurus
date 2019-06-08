/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default {
  onRouteUpdate({previousLocation, location}) {
    console.log('es onRouteUpdate', {
      previousLocation,
      location,
    });
  },
  onRouteUpdateDelayed({location}) {
    console.log('es onRouteUpdateDelayed', {location});
  },
};
