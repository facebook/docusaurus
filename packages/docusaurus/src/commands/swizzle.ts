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
import {partition} from 'lodash';
import {THEME_PATH} from '../constants';
import {loadContext, loadPluginConfigs} from '../server';
import initPlugins from '../server/plugins/init';
import {normalizePluginOptions} from '@docusaurus/utils-validation';

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

const formatComponentName = (componentName: string): string =>
  componentName
    .replace(/(\/|\\)index.(js|tsx|ts|jsx)/, '')
    .replace(/.(js|tsx|ts|jsx)/, '');

function readComponent(themePath: string) {
  return walk(themePath).map((filePath) =>
    formatComponentName(path.relative(themePath, filePath)),
  );
}

// load components from theme based on configurations
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

function themeComponents(themePath: string, plugin: Plugin<unknown>): string {
  const components = colorCode(themePath, plugin);

  if (components.length === 0) {
    return `${chalk.red('No component to swizzle')}`;
  }

  return `
${chalk.cyan('Theme Components available for swizzle')}

${chalk.green('green  =>')} recommended: lower breaking change risk
${chalk.red('red    =>')} internal: higher breaking change risk

${components.join('\n')}
`;
}

function formatedThemeNames(themeNames: string[]): string {
  return `Themes available for swizzle:\n${themeNames.join('\n')}`;
}

function colorCode(themePath: string, plugin: any): Array<string> {
  // support both commonjs and ES style exports
  const getSwizzleComponentList =
    plugin.default?.getSwizzleComponentList ?? plugin.getSwizzleComponentList;

  const components = readComponent(themePath);
  const allowedComponent = getSwizzleComponentList
    ? getSwizzleComponentList()
    : [];

  const [greenComponents, redComponents] = partition(components, (comp) =>
    allowedComponent.includes(comp),
  );

  return [
    ...greenComponents.map((component) => chalk.green(component)),
    ...redComponents.map((component) => chalk.red(component)),
  ];
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
    const resolvedThemeName = require.resolve(themeName);
    // find the plugin from list of plugin and get options if specified
    pluginConfigs.forEach((pluginConfig) => {
      // plugin can be a [string], [string,object] or string.
      if (Array.isArray(pluginConfig)) {
        if (require.resolve(pluginConfig[0]) === resolvedThemeName) {
          if (pluginConfig.length === 2) {
            const [, options] = pluginConfig;
            pluginOptions = options;
          }
        }
      }
    });
    if (validateOptions) {
      // normilize options
      const normalizedOptions = validateOptions({
        validate: normalizePluginOptions,
        options: pluginOptions,
      });
      pluginOptions = normalizedOptions;
    }
    const pluginInstance = plugin(context, pluginOptions);
    const themePath = typescript
      ? pluginInstance.getTypeScriptThemePath?.()
      : pluginInstance.getThemePath?.();
    const components = getComponentName(
      themePath,
      pluginModule,
      Boolean(danger),
    );
    if (componentName) {
      const formatedComponentName = formatComponentName(componentName);
      const isComponentExists = components.find(
        (component) => component === formatedComponentName,
      );
      let mostSuitableComponent = componentName;
      if (!isComponentExists) {
        let mostSuitableMatch = componentName;
        let score = formatedComponentName.length;
        components.forEach((component) => {
          if (
            component.toLowerCase() === formatedComponentName.toLowerCase()
          ) {
            // may be components with same lowercase key, try to match closest component
            const currentScore = leven(formatedComponentName, component);
            if (currentScore < score) {
              score = currentScore;
              mostSuitableMatch = component;
            }
          }
        });
        if (mostSuitableMatch) {
          mostSuitableComponent = mostSuitableMatch;
          console.log(
            chalk.red(`Component "${componentName}" doesn't exists.`),
            chalk.yellow(
              `"${mostSuitableComponent}" is swizzled instead of "${componentName}".`,
            ),
          );
        }
      }
      let fromPath = themePath;
      if (fromPath) {
        let toPath = path.resolve(siteDir, THEME_PATH);
        fromPath = path.join(fromPath, mostSuitableComponent);
        toPath = path.join(toPath, mostSuitableComponent);
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
              if (leven(name, mostSuitableComponent) < 3) {
                suggestion = name;
              }
            });
            throw new Error(
              `Component ${mostSuitableComponent} not found.${
                suggestion
                  ? ` Did you mean "${suggestion}"?`
                  : `${themeComponents(themePath, pluginModule)}`
              }`,
            );
          }
        }
        if (!components.includes(mostSuitableComponent) && !danger) {
          throw new Error(
            `${mostSuitableComponent} is an internal component, and have a higher breaking change probability. If you want to swizzle it, use the "--danger" flag.`,
          );
        }
        await fs.copy(fromPath, toPath);

        const relativeDir = path.relative(process.cwd(), toPath);
        const fromMsg = chalk.blue(
          mostSuitableComponent
            ? `${themeName} ${chalk.yellow(mostSuitableComponent)}`
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
      console.log(themeComponents(themePath, pluginModule));
    }
  }
}
