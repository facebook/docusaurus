/**
 * Copyright (c) 2020-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';

export default function customSW() {
  // Cache responses from external resources
  registerRoute(context => {
    return [
      /graph\.facebook\.com\/.*\/picture/,
      /netlify\.com\/img/,
      /avatars1\.githubusercontent/,
    ].some(regex => context.url.href.match(regex));
  }, new StaleWhileRevalidate());
}
