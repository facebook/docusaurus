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
import initPlugins, {pluginOptionsValidator} from '../server/plugins/init';

export function getPluginNames(plugins: PluginConfig[]): string[] {
  return plugins.map((plugin) => {
    const pluginPath = Array.isArray(plugin) ? plugin[0] : plugin;
    let packagePath = path.dirname(pluginPath);
    while (packagePath) {
      if (fs.existsSync(path.join(packagePath, 'package.json'))) {
        break;
      } else {
        packagePath = path.dirname(packagePath);
      }
    }
    if (packagePath === '.') {
      return pluginPath;
    }
    return (importFresh(path.join(packagePath, 'package.json')) as {
      name: string;
    }).name as string;
  });
}

function walk(dir: string): Array<string> {
  let results: Array<string> = [];
  const list = fs.readdirSync(dir);
  list.forEach((file: string) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (!/node_modules|.css|.d.ts|.d.map/.test(fullPath)) {
      results.push(fullPath);
    }
  });
  return results;
}

function readComponent(themePath: string) {
  return walk(themePath).map((filePath) =>
    path
      .relative(themePath, filePath)
      .replace(/(\/|\\)index.(js|tsx|ts|jsx)/, '')
      .replace(/.(js|tsx|ts|jsx)/, ''),
  );
}

function getComponentName(
  themePath: string,
  plugin: any,
  danger: boolean,
): Array<string> {
  // support both commonjs and ES style exports
  const getSwizzleComponentList =
    plugin.default?.getSwizzleComponentList ?? plugin.getSwizzleComponentList;
  if (getSwizzleComponentList) {
    const allowedComponent = getSwizzleComponentList();
    if (danger) {
      return readComponent(themePath);
    }
    return allowedComponent;
  }
  return readComponent(themePath);
}

function themeComponents(
  themePath: string,
  plugin: Plugin<unknown>,
  danger: boolean,
): string {
  const components = colorCode(themePath, plugin, danger);
  return `Theme Components available for swizzle:\n${components.join('\n')}`;
}

function formatedThemeNames(themeNames: string[]): string {
  return `Themes available for swizzle:\n${themeNames.join('\n')}`;
}

function colorCode(
  themePath: string,
  plugin: any,
  danger: boolean,
): Array<string> {
  // support both commonjs and ES style exports
  const getSwizzleComponentList =
    plugin.default?.getSwizzleComponentList ?? plugin.getSwizzleComponentList;
  if (getSwizzleComponentList) {
    const allowedComponent = getSwizzleComponentList();
    if (danger) {
      const components = readComponent(themePath);
      const componentMap = allowedComponent.reduce(
        (acc: {[key: string]: boolean}, component) => {
          acc[component] = true;
          return acc;
        },
        {},
      );
      const colorCodedComponent = components
        .filter((component) => !componentMap[component])
        .map((component) => chalk.red(component));
      return [
        ...allowedComponent.map((component) => chalk.green(component)),
        ...colorCodedComponent,
      ];
    }
    return allowedComponent;
  }
  return readComponent(themePath);
}

export default async function swizzle(
  siteDir: string,
  themeName?: string,
  componentName?: string,
  typescript?: boolean,
  danger?: boolean,
): Promise<void> {
  const context = loadContext(siteDir);
  const pluginConfigs = loadPluginConfigs(context);
  const pluginNames = getPluginNames(pluginConfigs);
  const plugins = initPlugins({
    pluginConfigs,
    context,
  });
  const themeNames = pluginNames.filter((_, index) =>
    typescript
      ? plugins[index].getTypeScriptThemePath
      : plugins[index].getThemePath,
  );
  if (!themeName) {
    console.log(formatedThemeNames(themeNames));
  } else {
    let pluginModule;
    try {
      pluginModule = importFresh(themeName) as (
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
          suggestion
            ? `Did you mean "${suggestion}" ?`
            : formatedThemeNames(themeNames)
        }`,
      );
    }
    const plugin = pluginModule.default ?? pluginModule;
    const validateOptions =
      pluginModule.default?.validateOptions ?? pluginModule.validateOptions;
    let pluginOptions;
    pluginConfigs.forEach((pluginConfig) => {
      if (Array.isArray(pluginConfig)) {
        if (require.resolve(pluginConfig[0]) === require.resolve(themeName)) {
          if (pluginConfig.length === 2) {
            const [, options] = pluginConfig;
            pluginOptions = options;
          }
        }
      }
    });
    if (validateOptions) {
      const normalizedOptions = validateOptions({
        validate: pluginOptionsValidator,
        options: pluginOptions,
      });
      pluginOptions = normalizedOptions;
    }
    const pluginInstance = plugin(context, pluginOptions);
    const themePath = typescript
      ? pluginInstance.getTypeScriptThemePath?.()
      : pluginInstance.getThemePath?.();
    if (componentName) {
      let fromPath = themePath;
      if (fromPath) {
        let toPath = path.resolve(siteDir, THEME_PATH);
        fromPath = path.join(fromPath, componentName);
        toPath = path.join(toPath, componentName);
        const components = getComponentName(
          themePath,
          pluginModule,
          Boolean(danger),
        );

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
            let suggestion;
            components.forEach((name) => {
              if (leven(name, componentName) < 3) {
                suggestion = name;
              }
            });
            throw new Error(
              `Component ${componentName} not found.${
                suggestion
                  ? ` Did you mean "${suggestion}"?`
                  : `${themeComponents(
                      themePath,
                      pluginModule,
                      Boolean(danger),
                    )}`
              }`,
            );
          }
        }
        if (!components.includes(componentName) && !danger) {
          throw new Error(
            `${componentName} is an internal component, if you want to swizzle it use "--danger" flag.`,
          );
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
      console.log(themeComponents(themePath, pluginModule, Boolean(danger)));
    }
  }
}
