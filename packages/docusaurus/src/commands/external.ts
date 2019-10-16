/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {CommanderStatic} from 'commander';
import {loadContext, loadPluginConfigs} from '../server';
import {initPlugins} from '../server/plugins/init';

export function externalCommand(cli: CommanderStatic, siteDir: string): void {
  const context = loadContext(siteDir);
  const pluginConfigs = loadPluginConfigs(context);
  const plugins = initPlugins({pluginConfigs, context});

  // Plugin lifecycle - extendCli
  plugins.forEach(plugin => {
    const {extendCli} = plugin;
    if (!extendCli) {
      return;
    }
    extendCli(cli);
  });
}
