/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import type {InitializedPlugin} from '@docusaurus/types';

/**
 * It is forbidden to have 2 plugins of the same name sharing the same ID.
 * This is required to support multi-instance plugins without conflict.
 */
export function ensureUniquePluginInstanceIds(
  plugins: InitializedPlugin[],
): void {
  const pluginsByName = _.groupBy(plugins, (p) => p.name);
  Object.entries(pluginsByName).forEach(([pluginName, pluginInstances]) => {
    const pluginInstancesById = _.groupBy(
      pluginInstances,
      (p) => p.options.id ?? DEFAULT_PLUGIN_ID,
    );
    Object.entries(pluginInstancesById).forEach(
      ([pluginId, pluginInstancesWithId]) => {
        if (pluginInstancesWithId.length !== 1) {
          throw new Error(
            `Plugin "${pluginName}" is used ${
              pluginInstancesWithId.length
            } times with ID "${pluginId}".\nTo use the same plugin multiple times on a Docusaurus site, you need to assign a unique ID to each plugin instance.${
              pluginId === DEFAULT_PLUGIN_ID
                ? `\n\nThe plugin ID is "${DEFAULT_PLUGIN_ID}" by default. It's possible that the preset you are using already includes a plugin instance, in which case you either want to disable the plugin in the preset (to use a single instance), or assign another ID to your extra plugin instance (to use multiple instances).`
                : ''
            }`,
          );
        }
      },
    );
  });
}
