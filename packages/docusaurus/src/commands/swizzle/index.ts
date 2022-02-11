/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import {loadContext, loadPluginConfigs} from '../../server';
import initPlugins, {normalizePluginConfigs} from '../../server/plugins/init';
import {getThemeName, getThemePath, getThemeNames} from './themes';
import {getThemeComponents, getComponentName} from './components';
import {actionsTable, statusTable, themeComponentsTable} from './tables';
import type {
  InitializedPlugin,
  SwizzleAction,
  SwizzleComponentConfig,
  ImportedPluginModule,
} from '@docusaurus/types';
import type {SwizzleOptions, SwizzlePlugin} from './common';
import {normalizeOptions} from './common';
import type {ActionResult} from './actions';
import {eject, getAction, wrap} from './actions';
import {getThemeSwizzleConfig} from './config';
import {askSwizzleDangerousComponent} from './prompts';
import {createRequire} from 'module';

async function listAllThemeComponents({
  themeNames,
  plugins,
  typescript,
}: {
  themeNames: string[];
  plugins: SwizzlePlugin[];
  typescript: SwizzleOptions['typescript'];
}) {
  const themeComponentsTables = (
    await Promise.all(
      themeNames.map((themeName) => {
        const themePath = getThemePath({themeName, plugins, typescript});
        const swizzleConfig = getThemeSwizzleConfig(themeName, plugins);
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

async function ensureActionSafety({
  componentName,
  componentConfig,
  action,
  danger,
}: {
  componentName: string;
  componentConfig: SwizzleComponentConfig;
  action: SwizzleAction;
  danger: boolean;
}): Promise<void> {
  const actionStatus = componentConfig.actions[action];

  if (actionStatus === 'forbidden') {
    logger.newLine();
    logger.error(
      `Swizzle action "${action}" is forbidden for component ${componentName}`,
    );
    logger.newLine();
    return process.exit(1);
  }

  if (actionStatus === 'unsafe' && !danger) {
    logger.newLine();
    logger.warn`Swizzle action name=${action} is unsafe to perform on name=${componentName}.
It is more likely to be affected by breaking changes in the future
If you want to swizzle it, use the code=${'--danger'} flag, or confirm that you understand the risks.`;
    logger.newLine();
    const swizzleDangerousComponent = await askSwizzleDangerousComponent();
    if (!swizzleDangerousComponent) {
      return process.exit(1);
    }
  }

  return undefined;
}

async function initSwizzle(
  siteDir: string,
): Promise<{plugins: SwizzlePlugin[]}> {
  const context = await loadContext(siteDir);
  const pluginRequire = createRequire(context.siteConfigPath);

  const pluginConfigs = await loadPluginConfigs(context);
  const plugins: InitializedPlugin[] = await initPlugins({
    pluginConfigs,
    context,
  });

  const pluginsNormalized = await normalizePluginConfigs(
    pluginConfigs,
    pluginRequire,
  );

  // For now only support imported plugin modules
  // TODO support inline themes?
  const modules: (ImportedPluginModule | undefined)[] = pluginsNormalized.map(
    (p) => p.pluginModule?.module,
  );

  const swizzlePlugins = plugins
    .map((plugin, pluginIndex) => ({
      module: modules[pluginIndex],
      instance: plugin,
    }))
    .filter((p) => p.module !== undefined) as SwizzlePlugin[];

  console.log({swizzlePlugins});

  return {
    plugins: swizzlePlugins,
  };
}

export default async function swizzle(
  siteDir: string,
  themeNameParam: string | undefined,
  componentNameParam: string | undefined,
  optionsParam: Partial<SwizzleOptions>,
): Promise<void> {
  const options = normalizeOptions(optionsParam);
  const {list, danger, typescript} = options;

  const {plugins} = await initSwizzle(siteDir);
  const themeNames = getThemeNames(plugins);

  if (list && !themeNameParam) {
    await listAllThemeComponents({themeNames, plugins, typescript});
  }

  const themeName = await getThemeName({themeNameParam, themeNames, list});
  const themePath = getThemePath({themeName, plugins, typescript});
  const swizzleConfig = getThemeSwizzleConfig(themeName, plugins);
  const themeComponents = getThemeComponents({
    themeName,
    themePath,
    swizzleConfig,
  });

  const componentName = await getComponentName({
    componentNameParam,
    themeComponents,
    list,
  });
  const componentConfig = themeComponents.getConfig(componentName);

  const action = await getAction(componentConfig, options);

  await ensureActionSafety({componentName, componentConfig, action, danger});

  async function executeAction(): Promise<ActionResult> {
    switch (action) {
      case 'wrap': {
        const result = await wrap({
          siteDir,
          themePath,
          componentName,
          typescript,
        });
        logger.newLine();
        logger.success`Wrapped code=${`${themeName} ${componentName}`} in path=${
          result.createdFiles
        }.`;
        logger.newLine();
        return result;
      }
      case 'eject': {
        const result = await eject({
          siteDir,
          themePath,
          componentName,
        });
        logger.newLine();
        logger.success`Ejected code=${`${themeName} ${componentName}`} to path=${
          result.createdFiles
        }.`;
        logger.newLine();
        return result;
      }
      default:
        throw new Error(`Unexpected action ${action}`);
    }
  }

  await executeAction();

  return process.exit(0);
}
