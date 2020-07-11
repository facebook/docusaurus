/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Module from 'module';
import {join} from 'path';
import importFresh from 'import-fresh';
import {
  LoadContext,
  Plugin,
  PluginConfig,
  ValidationSchema,
} from '@docusaurus/types';
import {PluginVersionInformation} from '@generated/site-metadata';
import {CONFIG_FILE_NAME} from '../../constants';
import {getPluginVersion} from '../versions';

function validate<T>(schema: ValidationSchema<T>, options: Partial<T>) {
  const {error, value} = schema.validate(options, {
    convert: false,
  });
  if (error) {
    throw error;
  }
  return value;
}

function validateAndStrip<T>(schema: ValidationSchema<T>, options: Partial<T>) {
  const {error, value} = schema.unknown().validate(options, {
    convert: false,
  });

  if (error) {
    throw error;
  }
  return value;
}

export type PluginWithVersionInformation = Plugin<unknown> & {
  readonly version: PluginVersionInformation;
};

export default function initPlugins({
  pluginConfigs,
  context,
}: {
  pluginConfigs: PluginConfig[];
  context: LoadContext;
}): PluginWithVersionInformation[] {
  // We need to resolve plugins from the perspective of the siteDir, since the siteDir's package.json
  // declares the dependency on these plugins.
  // We need to fallback to createRequireFromPath since createRequire is only available in node v12.
  // See: https://nodejs.org/api/modules.html#modules_module_createrequire_filename
  const createRequire = Module.createRequire || Module.createRequireFromPath;
  const pluginRequire = createRequire(join(context.siteDir, CONFIG_FILE_NAME));

  const plugins: PluginWithVersionInformation[] = pluginConfigs
    .map((pluginItem) => {
      let pluginModuleImport: string | undefined;
      let pluginOptions = {};

      if (!pluginItem) {
        return null;
      }

      if (typeof pluginItem === 'string') {
        pluginModuleImport = pluginItem;
      } else if (Array.isArray(pluginItem)) {
        [pluginModuleImport, pluginOptions = {}] = pluginItem;
      }

      if (!pluginModuleImport) {
        return null;
      }

      // The pluginModuleImport value is any valid
      // module identifier - npm package or locally-resolved path.
      const pluginPath = pluginRequire.resolve(pluginModuleImport);
      const pluginModule: any = importFresh(pluginPath);
      const pluginVersion = getPluginVersion(pluginPath, context.siteDir);

      const plugin = pluginModule.default || pluginModule;

      // support both commonjs and ES modules
      const validateOptions =
        pluginModule.default?.validateOptions ?? pluginModule.validateOptions;

      if (validateOptions) {
        const normalizedOptions = validateOptions({
          validate,
          options: pluginOptions,
        });
        pluginOptions = normalizedOptions;
      }

      // support both commonjs and ES modules
      const validateThemeConfig =
        pluginModule.default?.validateThemeConfig ??
        pluginModule.validateThemeConfig;

      if (validateThemeConfig) {
        const normalizedThemeConfig = validateThemeConfig({
          validate: validateAndStrip,
          themeConfig: context.siteConfig.themeConfig,
        });

        context.siteConfig.themeConfig = {
          ...context.siteConfig.themeConfig,
          ...normalizedThemeConfig,
        };
      }
      return {...plugin(context, pluginOptions), version: pluginVersion};
    })
    .filter(Boolean);
  return plugins;
}
