/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import importFresh from 'import-fresh';
import {keyBy, mapValues} from 'lodash';
import type {
  ImportedPluginModule,
  SwizzleComponentConfig,
  SwizzleConfig,
} from '@docusaurus/types';
import {SwizzleActions} from './common';

function getModuleSwizzleConfig(
  pluginModule: ImportedPluginModule,
): SwizzleConfig | undefined {
  const getSwizzleConfig =
    pluginModule.default?.getSwizzleConfig ?? pluginModule.getSwizzleConfig;
  if (getSwizzleConfig) {
    return getSwizzleConfig();
  }

  // TODO deprecate getSwizzleComponentList later
  const getSwizzleComponentList =
    pluginModule.default?.getSwizzleComponentList ??
    pluginModule.getSwizzleComponentList;
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

// TODO we shouldn't need to use importFresh here: we already have imported the plugin modules!
// Current approach does not work with an inline theme plugin (although it's unusual)
export function getThemeSwizzleConfig(themeName: string): SwizzleConfig {
  const module = importFresh<ImportedPluginModule>(themeName);
  const config = getModuleSwizzleConfig(module);
  if (config) {
    return validateSwizzleConfig(config);
  }
  return FallbackSwizzleConfig;
}
