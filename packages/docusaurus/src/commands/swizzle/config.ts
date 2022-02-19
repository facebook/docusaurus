/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import type {SwizzleComponentConfig, SwizzleConfig} from '@docusaurus/types';
import type {SwizzlePlugin} from './common';
import {SwizzleActions, SwizzleActionsStatuses} from './common';
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
      components: Object.fromEntries(
        safeComponents.map((comp) => [comp, safeComponentConfig]),
      ),
    };
  }

  return undefined;
}

export function normalizeSwizzleConfig(
  unsafeSwizzleConfig: unknown,
): SwizzleConfig {
  const schema = Joi.object<SwizzleConfig>({
    components: Joi.object()
      .pattern(
        Joi.string(),
        Joi.object({
          actions: Joi.object().pattern(
            Joi.string().valid(...SwizzleActions),
            Joi.string().valid(...SwizzleActionsStatuses),
          ),
          description: Joi.string(),
        }),
      )
      .required(),
  });

  const result = schema.validate(unsafeSwizzleConfig);

  if (result.error) {
    throw new Error(
      `Swizzle config does not match expected schema: ${result.error.message}`,
    );
  }

  const swizzleConfig: SwizzleConfig = result.value;

  // Ensure all components always declare all actions
  Object.values(swizzleConfig.components).forEach((componentConfig) => {
    SwizzleActions.forEach((action) => {
      if (!componentConfig.actions[action]) {
        componentConfig.actions[action] = 'unsafe';
      }
    });
  });

  return swizzleConfig;
}

const FallbackSwizzleConfig: SwizzleConfig = {
  components: {},
};

export function getThemeSwizzleConfig(
  themeName: string,
  plugins: SwizzlePlugin[],
): SwizzleConfig {
  const plugin = getPluginByThemeName(plugins, themeName);
  const config = getModuleSwizzleConfig(plugin);
  if (config) {
    try {
      return normalizeSwizzleConfig(config);
    } catch (e) {
      throw new Error(
        `Invalid Swizzle config for theme ${themeName}.\n${
          (e as Error).message
        }`,
      );
    }
  }
  return FallbackSwizzleConfig;
}
