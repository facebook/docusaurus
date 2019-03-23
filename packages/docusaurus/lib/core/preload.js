/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {matchRoutes} from 'react-router-config';

/**
 * This helps us to make sure all the async component for that particular route
 * is loaded before rendering. This is to avoid loading screens on first page load
 */
export default function preload(routeConfig, providedLocation) {
  const matches = matchRoutes(routeConfig, providedLocation);
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
