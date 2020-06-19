/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Module from 'module';
import {join} from 'path';
import importFresh from 'import-fresh';
import {LoadContext, Plugin, PluginConfig} from '@docusaurus/types';
import {Schema} from '@hapi/joi';
const chalk = require('chalk');
import {CONFIG_FILE_NAME} from '../../constants';

function printError(error) {
  console.log(
    chalk.red(
      `Validation Errors:${error?.errors?.reduce(
        (formatedError, error, i) => `${formatedError}\n${i + 1}. ${error}`,
        '',
      )}`,
    ),
  );
  process.exit(1);
}

function validate(schema: Schema, options: unknown) {
  const {error, errors, value} = schema.validate(options, {
    abortEarly: false,
    convert: false,
  });

  if (error) {
    printError(errors);
  }
  return value;
}

function validateAndStrip(schema: Schema, options: unknown) {
  const {error, errors, value} = schema.validate(options, {
    abortEarly: false,
    stripUnknown: true,
    convert: false,
  });

  if (error) {
    printError(errors);
  }
  return value;
}

export function initPlugins({
  pluginConfigs,
  context,
}: {
  pluginConfigs: PluginConfig[];
  context: LoadContext;
}): Plugin<any>[] {
  // We need to resolve plugins from the perspective of the siteDir, since the siteDir's package.json
  // declares the dependency on these plugins.
  // We need to fallback to createRequireFromPath since createRequire is only available in node v12.
  // See: https://nodejs.org/api/modules.html#modules_module_createrequire_filename
  const createRequire = Module.createRequire || Module.createRequireFromPath;
  const pluginRequire = createRequire(join(context.siteDir, CONFIG_FILE_NAME));

  const plugins: Plugin<any>[] = pluginConfigs
    .map((pluginItem) => {
      let pluginModuleImport: string | undefined;
      let pluginOptions = {};

      if (!pluginItem) {
        return null;
      }

      if (typeof pluginItem === 'string') {
        pluginModuleImport = pluginItem;
      } else if (Array.isArray(pluginItem)) {
        pluginModuleImport = pluginItem[0];
        pluginOptions = pluginItem[1] || {};
      }

      if (!pluginModuleImport) {
        return null;
      }

      // The pluginModuleImport value is any valid
      // module identifier - npm package or locally-resolved path.
      const pluginModule: any = importFresh(
        pluginRequire.resolve(pluginModuleImport),
      );

      const plugin = pluginModule.default || pluginModule;
      if (plugin.validateOptions) {
        const options = plugin.validateOptions({
          validate,
          options: pluginOptions,
        });
        pluginOptions = options;
      }
      if (plugin.validateThemeConfig) {
        const validatedTheme = plugin.validateThemeConfig({
          validate: validateAndStrip,
          themeConfig: context.siteConfig.themeConfig,
        });
        context.siteConfig.themeConfig = {
          ...context.siteConfig.themeConfig,
          ...validatedTheme,
        };
      }
      return plugin(context, pluginOptions);
    })
    .filter(Boolean);
  return plugins;
}
