/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {CommanderStatic} from 'commander';
import {loadContext, loadPluginConfigs} from '../server';
import initPlugins from '../server/plugins/init';

export default async function externalCommand(
  cli: CommanderStatic,
  siteDir: string,
): Promise<void> {
  const context = await loadContext(siteDir);
  const pluginConfigs = loadPluginConfigs(context);
  const plugins = initPlugins({pluginConfigs, context});

  // Plugin Lifecycle - extendCli.
  plugins.forEach((plugin) => {
    const {extendCli} = plugin;

    if (!extendCli) {
      return;
    }

    extendCli(cli);
  });
}
