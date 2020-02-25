/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {matchRoutes} from 'react-router-config';

/**
 * Helper function to make sure all async components for that particular route
 * is preloaded before rendering. This is especially useful to avoid loading screens.
 *
 * @param {Array<RouteConfig>} routes react-router-config
 * @param {string} pathname the route pathname, example: /docs/installation
 * @returns {Promise} Promise object represents whether pathname has been preloaded
 */
export default function preload(routes, pathname) {
  const matches = matchRoutes(routes, pathname);

  return Promise.all(
    matches.map(match => {
      const {component} = match.route;

      if (component && component.preload) {
        return component.preload();
      }

      return undefined;
    }),
  );
}
