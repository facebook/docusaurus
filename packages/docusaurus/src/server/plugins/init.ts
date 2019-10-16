/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import importFresh from 'import-fresh';
import {LoadContext, Plugin, PluginConfig} from '@docusaurus/types';

export function initPlugins({
  pluginConfigs,
  context,
}: {
  pluginConfigs: PluginConfig[];
  context: LoadContext;
}): Plugin<any>[] {
  const plugins: Plugin<any>[] = _.compact(
    pluginConfigs.map(pluginItem => {
      let pluginModuleImport;
      let pluginOptions = {};
      if (!pluginItem) {
        return null;
      }

      if (typeof pluginItem === 'string') {
        pluginModuleImport = pluginItem;
      } else if (Array.isArray(pluginItem)) {
        pluginModuleImport = pluginItem[0];
        pluginOptions = pluginItem[1] || {};
      }

      if (!pluginModuleImport) {
        return null;
      }

      // module is any valid module identifier - npm package or locally-resolved path.
      const isProd = process.env.NODE_ENV === 'production';
      const pluginModule: any = isProd
        ? importFresh(pluginModuleImport)
        : require(pluginModuleImport);
      return (pluginModule.default || pluginModule)(context, pluginOptions);
    }),
  );

  return plugins;
}
