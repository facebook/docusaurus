/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRequire} from 'module';
import path from 'path';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import {
  normalizePluginOptions,
  normalizeThemeConfig,
} from '@docusaurus/utils-validation';
import {getPluginVersion} from '../siteMetadata';
import {ensureUniquePluginInstanceIds} from './pluginIds';
import {loadPluginConfigs, type NormalizedPluginConfig} from './configs';
import type {
  PluginVersionInformation,
  LoadContext,
  PluginModule,
  PluginOptions,
  InitializedPlugin,
} from '@docusaurus/types';

function getOptionValidationFunction(
  normalizedPluginConfig: NormalizedPluginConfig,
): PluginModule['validateOptions'] {
  if (normalizedPluginConfig.pluginModule) {
    // Support both CommonJS and ES modules
    return (
      normalizedPluginConfig.pluginModule.module.default?.validateOptions ??
      normalizedPluginConfig.pluginModule.module.validateOptions
    );
  }
  return normalizedPluginConfig.plugin.validateOptions;
}

function getThemeValidationFunction(
  normalizedPluginConfig: NormalizedPluginConfig,
): PluginModule['validateThemeConfig'] {
  if (normalizedPluginConfig.pluginModule) {
    // Support both CommonJS and ES modules
    return (
      normalizedPluginConfig.pluginModule.module.default?.validateThemeConfig ??
      normalizedPluginConfig.pluginModule.module.validateThemeConfig
    );
  }
  return normalizedPluginConfig.plugin.validateThemeConfig;
}

/**
 * Runs the plugin constructors and returns their return values. It would load
 * plugin configs from `plugins`, `themes`, and `presets`.
 */
export async function initPlugins(
  context: LoadContext,
): Promise<InitializedPlugin[]> {
  // We need to resolve plugins from the perspective of the site config, as if
  // we are using `require.resolve` on those module names.
  const pluginRequire = createRequire(context.siteConfigPath);
  const pluginConfigs = await loadPluginConfigs(context);

  async function doGetPluginVersion(
    normalizedPluginConfig: NormalizedPluginConfig,
  ): Promise<PluginVersionInformation> {
    if (normalizedPluginConfig.pluginModule?.path) {
      const pluginPath = pluginRequire.resolve(
        normalizedPluginConfig.pluginModule.path,
      );
      return getPluginVersion(pluginPath, context.siteDir);
    }
    return {type: 'local'};
  }

  function doValidateThemeConfig(
    normalizedPluginConfig: NormalizedPluginConfig,
  ) {
    const validateThemeConfig = getThemeValidationFunction(
      normalizedPluginConfig,
    );
    if (validateThemeConfig) {
      return validateThemeConfig({
        validate: normalizeThemeConfig,
        themeConfig: context.siteConfig.themeConfig,
      });
    }
    return context.siteConfig.themeConfig;
  }

  function doValidatePluginOptions(
    normalizedPluginConfig: NormalizedPluginConfig,
  ): Required<PluginOptions> {
    const validateOptions = getOptionValidationFunction(normalizedPluginConfig);
    if (validateOptions) {
      return validateOptions({
        validate: normalizePluginOptions,
        options: normalizedPluginConfig.options,
      });
    }
    // Important to ensure all plugins have an id
    // as we don't go through the Joi schema that adds it
    return {
      ...normalizedPluginConfig.options,
      id: normalizedPluginConfig.options.id ?? DEFAULT_PLUGIN_ID,
    };
  }

  async function initializePlugin(
    normalizedPluginConfig: NormalizedPluginConfig,
  ): Promise<InitializedPlugin> {
    const pluginVersion: PluginVersionInformation = await doGetPluginVersion(
      normalizedPluginConfig,
    );
    const pluginOptions = doValidatePluginOptions(normalizedPluginConfig);

    // Side-effect: merge the normalized theme config in the original one
    context.siteConfig.themeConfig = {
      ...context.siteConfig.themeConfig,
      ...doValidateThemeConfig(normalizedPluginConfig),
    };

    const pluginInstance = await normalizedPluginConfig.plugin(
      context,
      pluginOptions,
    );

    return {
      ...pluginInstance,
      options: pluginOptions,
      version: pluginVersion,
      path: path.dirname(normalizedPluginConfig.entryPath),
    };
  }

  const plugins: InitializedPlugin[] = await Promise.all(
    pluginConfigs.map(initializePlugin),
  );

  ensureUniquePluginInstanceIds(plugins);

  return plugins;
}
