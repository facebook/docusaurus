/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import {loadContext} from '../server/site';
import {initPlugins} from '../server/plugins/init';
import type {CommanderStatic} from 'commander';

export async function externalCommand({
  cli,
  siteDir: siteDirInput,
  config,
}: {
  cli: CommanderStatic;
  siteDir: string;
  config: string | undefined;
}): Promise<void> {
  const siteDir = await fs.realpath(siteDirInput);
  const context = await loadContext({siteDir, config});
  const plugins = await initPlugins(context);

  // Plugin Lifecycle - extendCli.
  plugins.forEach((plugin) => {
    plugin.extendCli?.(cli);
  });
}
