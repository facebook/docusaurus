/**
 * Copyright (c) 2020-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* global workbox */

// Cache responses from external resources
workbox.routing.registerRoute(context => {
  return [
    /graph\.facebook\.com\/.*\/picture/,
    /netlify\.com\/img/,
    /avatars1\.githubusercontent/,
  ].some(regex => context.url.href.match(regex));
}, new workbox.strategies.StaleWhileRevalidate());
