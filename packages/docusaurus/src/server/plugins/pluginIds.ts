/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {groupBy} from 'lodash';
import {InitPlugin} from './init';
import {DEFAULT_PLUGIN_ID} from '../../constants';

// It is forbidden to have 2 plugins of the same name sharing the same id
// this is required to support multi-instance plugins without conflict
export function ensureUniquePluginInstanceIds(plugins: InitPlugin[]): void {
  const pluginsByName = groupBy(plugins, (p) => p.name);
  Object.entries(pluginsByName).forEach(([pluginName, pluginInstances]) => {
    const pluginInstancesById = groupBy(
      pluginInstances,
      (p) => p.options.id ?? DEFAULT_PLUGIN_ID,
    );
    Object.entries(pluginInstancesById).forEach(
      ([pluginId, pluginInstancesWithId]) => {
        if (pluginInstancesWithId.length !== 1) {
          throw new Error(
            `Plugin ${pluginName} is used ${pluginInstancesWithId.length} times with id=${pluginId}.\nTo use the same plugin multiple times on a Docusaurus site, you need to assign a unique id to each plugin instance.`,
          );
        }
      },
    );
  });
}
