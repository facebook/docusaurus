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
import {getThemeComponents, getComponentName} from './components';
import {actionsTable, statusTable, themeComponentsTable} from './tables';
import type {InitializedPlugin} from '@docusaurus/types';
import type {SwizzleOptions} from './common';
import {normalizeOptions} from './common';
import {executeAction, getAction} from './actions';
import {getThemeSwizzleConfig} from './config';

async function listAllThemeComponents({
  themeNames,
  plugins,
  typescript,
}: {
  themeNames: string[];
  plugins: InitializedPlugin[];
  typescript: SwizzleOptions['typescript'];
}) {
  const themeComponentsTables = (
    await Promise.all(
      themeNames.map((themeName) => {
        const themePath = getThemePath({themeName, plugins, typescript});
        const swizzleConfig = getThemeSwizzleConfig(themeName);
        const themeComponents = getThemeComponents({
          themeName,
          themePath,
          swizzleConfig,
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
  optionsParam: Partial<SwizzleOptions>,
): Promise<void> {
  const options = normalizeOptions(optionsParam);
  const {list, danger, typescript} = options;

  const context = await loadContext(siteDir);
  const pluginConfigs = loadPluginConfigs(context);
  const plugins = await initPlugins({pluginConfigs, context});
  const themeNames = getThemeNames(plugins);

  if (list && !themeNameParam) {
    await listAllThemeComponents({themeNames, plugins, typescript});
  }

  const themeName = await getThemeName({themeNameParam, themeNames, list});
  const themePath = getThemePath({themeName, plugins, typescript});
  const swizzleConfig = getThemeSwizzleConfig(themeName);
  const themeComponents = getThemeComponents({
    themeName,
    themePath,
    swizzleConfig,
  });

  const componentName = await getComponentName({
    componentNameParam,
    themeComponents,
    list,
    danger,
  });
  const componentConfig = themeComponents.getConfig(componentName);

  const action = await getAction(componentConfig, options);
  const result = await executeAction({
    action,
    siteDir,
    themePath,
    componentName,
    typescript,
  });
  const createdFiles = result.createdFiles.map((file) =>
    path.relative(process.cwd(), file),
  );
  switch (action) {
    case 'wrap':
      logger.success`Wrapped code=${`${themeName} ${componentName}`} in path=${createdFiles}.`;
      break;
    case 'eject':
      logger.success`Ejected code=${`${themeName} ${componentName}`} to path=${createdFiles}.`;
      break;
    default:
      throw new Error(`Unexpected action ${action}`);
  }

  return process.exit(0);
}
