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

  return swizzleConfig as SwizzleConfig;
}

export function getThemeSwizzleConfig(
  themeName: string,
): SwizzleConfig | undefined {
  const module = importFresh<ImportedPluginModule>(themeName);
  const config = getModuleSwizzleConfig(module);
  if (config) {
    return validateSwizzleConfig(config);
  }
  return undefined;
}
