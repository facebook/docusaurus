/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import path from 'path';
import {loadContext, loadPluginConfigs} from '../../server';
import initPlugins from '../../server/plugins/init';
import {getThemeName, getThemePath, getThemeNames} from './themes';
import {
  getThemeComponents,
  getComponentName,
  copyThemeComponent,
} from './components';
import {actionsTable, statusTable, themeComponentsTable} from './tables';
import type {InitializedPlugin} from '@docusaurus/types';

type Options = {
  typescript?: boolean;
  danger?: boolean;
  list?: boolean;
};

async function listAllThemeComponents({
  themeNames,
  plugins,
  typescript,
}: {
  themeNames: string[];
  plugins: InitializedPlugin[];
  typescript: Options['typescript'];
}) {
  const themeComponentsTables = (
    await Promise.all(
      themeNames.map((themeName) => {
        const themePath = getThemePath({themeName, plugins, typescript});
        const themeComponents = getThemeComponents({
          themeName,
          themePath,
        });
        return themeComponentsTable(themeComponents);
      }),
    )
  ).join('\n\n');

  logger.info(`All theme components available to swizzle:

${themeComponentsTables}

${actionsTable()}
${statusTable()}
    `);
  return process.exit(0);
}

export default async function swizzle(
  siteDir: string,
  themeNameParam: string | undefined,
  componentNameParam: string | undefined,
  {typescript, danger, list}: Options,
): Promise<void> {
  const context = await loadContext(siteDir);
  const pluginConfigs = loadPluginConfigs(context);
  const plugins = await initPlugins({pluginConfigs, context});
  const themeNames = getThemeNames(plugins);

  if (list && !themeNameParam) {
    await listAllThemeComponents({themeNames, plugins, typescript});
  }

  const themeName = await getThemeName({themeNameParam, themeNames, list});
  const themePath = getThemePath({themeName, plugins, typescript});
  const themeComponents = getThemeComponents({
    themeName,
    themePath,
  });
  const componentName = await getComponentName({
    componentNameParam,
    themeComponents,
    list,
    danger,
  });
  const {to} = await copyThemeComponent({
    siteDir,
    themePath,
    componentName,
  });
  logger.success`Copied code=${`${themeName} ${componentName}`} to path=${path.relative(
    process.cwd(),
    to,
  )}.`;
  return process.exit(0);
}
