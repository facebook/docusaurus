/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chalk = require('chalk');
import fs from 'fs-extra';
import importFresh from 'import-fresh';
import path from 'path';
import {Plugin, LoadContext, PluginConfig} from '@docusaurus/types';
import leven from 'leven';

import {THEME_PATH} from '../constants';
import {loadContext, loadPluginConfigs} from '../server';
import initPlugins from '../server/plugins/init';

export function getPluginNames(plugins: PluginConfig[]): string[] {
  return plugins.map((plugin) => {
    const pluginPath = Array.isArray(plugin) ? plugin[0] : plugin;
    if (pluginPath.includes(path.sep)) {
      let packagePath = pluginPath.substring(
        0,
        pluginPath.lastIndexOf(path.sep),
      );
      while (packagePath) {
        if (fs.existsSync(`${packagePath}/package.json`)) {
          break;
        } else {
          packagePath = packagePath.substring(
            0,
            packagePath.lastIndexOf(path.sep),
          );
        }
      }
      if (packagePath === '') {
        return pluginPath;
      }
      return (importFresh(`${packagePath}/package.json`) as {name: string})
        .name as string;
    }
    return pluginPath;
  });
}

export default async function swizzle(
  siteDir: string,
  themeName?: string,
  componentName?: string,
  typescript?: boolean,
): Promise<void> {
  const context = loadContext(siteDir);
  const pluginNames = getPluginNames(loadPluginConfigs(context));
  const plugins = initPlugins({
    pluginConfigs: loadPluginConfigs(context),
    context,
  });
  const themeNames = pluginNames.filter((_, index) =>
    typescript
      ? plugins[index].getTypeScriptThemePath
      : plugins[index].getThemePath,
  );
  if (!themeName) {
    console.log(`Themes available for swizzle:\n${themeNames.join('\n')}`);
  } else {
    let plugin;
    try {
      plugin = importFresh(themeName) as (
        context: LoadContext,
      ) => Plugin<unknown>;
    } catch {
      let suggestion;
      themeNames.forEach((name) => {
        if (leven(name, themeName) < 4) {
          suggestion = name;
        }
      });
      throw new Error(
        `Theme ${themeName} not found. ${
          suggestion ? `Did you mean "${suggestion}" ?` : ''
        }`,
      );
    }
    const pluginInstance = plugin(context);
    const themePath = typescript
      ? pluginInstance.getTypeScriptThemePath?.()
      : pluginInstance.getThemePath?.();
    if (componentName) {
      let fromPath = themePath;
      if (fromPath) {
        let toPath = path.resolve(siteDir, THEME_PATH);
        fromPath = path.join(fromPath, componentName);
        toPath = path.join(toPath, componentName);

        // Handle single TypeScript/JavaScript file only.
        // E.g: if <fromPath> does not exist, we try to swizzle <fromPath>.(ts|tsx|js) instead
        if (!fs.existsSync(fromPath)) {
          if (fs.existsSync(`${fromPath}.ts`)) {
            [fromPath, toPath] = [`${fromPath}.ts`, `${toPath}.ts`];
          } else if (fs.existsSync(`${fromPath}.tsx`)) {
            [fromPath, toPath] = [`${fromPath}.tsx`, `${toPath}.tsx`];
          } else if (fs.existsSync(`${fromPath}.js`)) {
            [fromPath, toPath] = [`${fromPath}.js`, `${toPath}.js`];
          } else {
            const components = fs.readdirSync(themePath);
            let suggestion;
            components.forEach((name) => {
              if (
                leven(name.replace(/.(ts|tsx|js|jsx)/, ''), componentName) < 2
              ) {
                suggestion = name;
              }
            });
            throw new Error(
              `Component ${componentName} not found.${
                suggestion ? ` Did you mean "${suggestion}"?` : ''
              }`,
            );
          }
        }

        await fs.copy(fromPath, toPath);

        const relativeDir = path.relative(process.cwd(), toPath);
        const fromMsg = chalk.blue(
          componentName
            ? `${themeName} ${chalk.yellow(componentName)}`
            : themeName,
        );
        const toMsg = chalk.cyan(relativeDir);
        console.log(
          `\n${chalk.green('Success!')} Copied ${fromMsg} to ${toMsg}.\n`,
        );
      } else if (typescript) {
        console.warn(
          chalk.yellow(
            `${themeName} does not provide TypeScript theme code via getTypeScriptThemePath().`,
          ),
        );
      } else {
        console.warn(
          chalk.yellow(`${themeName} does not provide any theme code.`),
        );
      }
    } else {
      const components = fs.readdirSync(themePath);
      console.log(`Theme Components available for swizzle:\n${components.join('\n')}`);
    }
  }
}
