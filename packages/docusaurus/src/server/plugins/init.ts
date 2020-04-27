/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import importFresh from 'import-fresh';
import {LoadContext, Plugin, PluginConfig} from '@docusaurus/types';

export default function initPlugins({
  pluginConfigs,
  context,
}: {
  pluginConfigs: PluginConfig[];
  context: LoadContext;
}): Plugin<any>[] {
  const plugins: Plugin<any>[] = pluginConfigs
    .map((pluginItem) => {
      let pluginModuleImport;
      let pluginOptions = {};

      if (!pluginItem) {
        return null;
      }

      if (typeof pluginItem === 'string') {
        pluginModuleImport = pluginItem;
      } else if (Array.isArray(pluginItem)) {
        [pluginModuleImport, pluginOptions = {}] = pluginItem;
      }

      if (!pluginModuleImport) {
        return null;
      }

      // The pluginModuleImport value is any valid
      // module identifier - npm package or locally-resolved path.
      const pluginModule: any = importFresh(pluginModuleImport);
      return (pluginModule.default || pluginModule)(context, pluginOptions);
    })
    .filter(Boolean);

  return plugins;
}
