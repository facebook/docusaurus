/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {Plugin} from '../types';

export function loadClientModules(plugins: Plugin<any>[]): string[] {
  return _.compact(
    _.flatten<string | null>(
      plugins.map(plugin => {
        if (!plugin.getClientModules) {
          return null;
        }

        return plugin.getClientModules();
      }),
    ),
  );
}
