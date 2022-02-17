/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {keyBy, mapValues} from 'lodash';
import type {SwizzleComponentConfig, SwizzleConfig} from '@docusaurus/types';
import type {SwizzlePlugin} from './common';
import {SwizzleActions} from './common';
import {getPluginByThemeName} from './themes';

function getModuleSwizzleConfig(
  swizzlePlugin: SwizzlePlugin,
): SwizzleConfig | undefined {
  const getSwizzleConfig =
    swizzlePlugin.plugin.plugin?.getSwizzleConfig ??
    swizzlePlugin.plugin.pluginModule?.module.getSwizzleConfig ??
    swizzlePlugin.plugin.pluginModule?.module?.getSwizzleConfig;

  if (getSwizzleConfig) {
    return getSwizzleConfig();
  }

  // TODO deprecate getSwizzleComponentList later
  const getSwizzleComponentList =
    swizzlePlugin.plugin.plugin?.getSwizzleComponentList ??
    swizzlePlugin.plugin.pluginModule?.module.getSwizzleComponentList ??
    swizzlePlugin.plugin.pluginModule?.module?.getSwizzleComponentList;

  if (getSwizzleComponentList) {
    const safeComponents = getSwizzleComponentList() ?? [];
    const safeComponentConfig: SwizzleComponentConfig = {
      actions: {
        eject: 'safe',
        wrap: 'safe',
      },
      description: undefined,
    };
    return {
      components: mapValues(keyBy(safeComponents), () => safeComponentConfig),
    };
  }

  return undefined;
}

function validateSwizzleConfig(swizzleConfig: unknown): SwizzleConfig {
  // TODO add Joi schema validation

  const normalizedSwizzleConfig = swizzleConfig as SwizzleConfig;

  // Ensure all components always declare all actions
  Object.values(normalizedSwizzleConfig.components).forEach(
    (componentConfig) => {
      SwizzleActions.forEach((action) => {
        if (!componentConfig.actions[action]) {
          componentConfig.actions[action] = 'unsafe';
        }
      });
    },
  );

  return normalizedSwizzleConfig;
}

const FallbackSwizzleConfig: SwizzleConfig = {
  components: {},
};

export function getThemeSwizzleConfig(
  themeName: string,
  plugins: SwizzlePlugin[],
): SwizzleConfig {
  // const module = importFresh<ImportedPluginModule>(themeName);
  const plugin = getPluginByThemeName(plugins, themeName);
  const config = getModuleSwizzleConfig(plugin);
  if (config) {
    return validateSwizzleConfig(config);
  }
  return FallbackSwizzleConfig;
}
