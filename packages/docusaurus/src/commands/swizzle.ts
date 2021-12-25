/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import fs from 'fs-extra';
import importFresh from 'import-fresh';
import path from 'path';
import {ImportedPluginModule, PluginConfig} from '@docusaurus/types';
import leven from 'leven';
import {partition} from 'lodash';
import {THEME_PATH} from '@docusaurus/utils';
import {loadContext, loadPluginConfigs} from '../server';
import initPlugins from '../server/plugins/init';
import {normalizePluginOptions} from '@docusaurus/utils-validation';

export function getPluginNames(plugins: PluginConfig[]): string[] {
  return plugins
    .filter(
      (plugin) =>
        typeof plugin === 'string' ||
        (Array.isArray(plugin) && typeof plugin[0] === 'string'),
    )
    .map((plugin) => {
      const pluginPath = Array.isArray(plugin) ? plugin[0] : plugin;
      if (typeof pluginPath === 'string') {
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
        return importFresh<{name: string}>(
          path.join(packagePath, 'package.json'),
        ).name;
      }

      return '';
    })
    .filter((plugin) => plugin !== '');
}

const formatComponentName = (componentName: string): string =>
  componentName
    .replace(/(\/|\\)index\.(js|tsx|ts|jsx)/, '')
    .replace(/\.(js|tsx|ts|jsx)/, '');

function readComponent(themePath: string) {
  function walk(dir: string): Array<string> {
    let results: Array<string> = [];
    const list = fs.readdirSync(dir);
    list.forEach((file: string) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(fullPath));
      } else if (!/\.css|\.d\.ts|\.d\.map/.test(fullPath)) {
        results.push(fullPath);
      }
    });
    return results;
  }

  return walk(themePath).map((filePath) =>
    formatComponentName(path.relative(themePath, filePath)),
  );
}

// load components from theme based on configurations
function getComponentName(
  themePath: string,
  plugin: ImportedPluginModule,
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
  plugin: ImportedPluginModule,
): string {
  const components = colorCode(themePath, plugin);

  if (components.length === 0) {
    return 'No component to swizzle.';
  }

  return `Theme components available for swizzle.

${logger.green(logger.bold('green  =>'))} safe: lower breaking change risk
${logger.red(logger.bold('red    =>'))} unsafe: higher breaking change risk

${components.join('\n')}
`;
}

function colorCode(
  themePath: string,
  plugin: ImportedPluginModule,
): Array<string> {
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
    ...greenComponents.map(
      (component) => `${logger.green(logger.bold('safe:'))}   ${component}`,
    ),
    ...redComponents.map(
      (component) => `${logger.red(logger.bold('unsafe:'))} ${component}`,
    ),
  ];
}

export default async function swizzle(
  siteDir: string,
  themeName?: string,
  componentName?: string,
  typescript?: boolean,
  danger?: boolean,
): Promise<void> {
  const context = await loadContext(siteDir);
  const pluginConfigs = loadPluginConfigs(context);
  const pluginNames = getPluginNames(pluginConfigs);
  const plugins = await initPlugins({
    pluginConfigs,
    context,
  });
  const themeNames = pluginNames.filter((_, index) =>
    typescript
      ? plugins[index].getTypeScriptThemePath
      : plugins[index].getThemePath,
  );

  if (!themeName) {
    logger.info`Themes available for swizzle: name=${themeNames}`;
    return;
  }

  let pluginModule: ImportedPluginModule;
  try {
    pluginModule = importFresh(themeName);
  } catch {
    let suggestion: string | undefined;
    themeNames.forEach((name) => {
      if (leven(name, themeName) < 4) {
        suggestion = name;
      }
    });
    logger.error`Theme name=${themeName} not found. ${
      suggestion
        ? logger.interpolate`Did you mean name=${suggestion}?`
        : logger.interpolate`Themes available for swizzle: ${themeNames}`
    }`;
    process.exit(1);
  }

  let pluginOptions = {};
  const resolvedThemeName = require.resolve(themeName);
  // find the plugin from list of plugin and get options if specified
  pluginConfigs.forEach((pluginConfig) => {
    // plugin can be a [string], [string,object] or string.
    if (Array.isArray(pluginConfig) && typeof pluginConfig[0] === 'string') {
      if (require.resolve(pluginConfig[0]) === resolvedThemeName) {
        if (pluginConfig.length === 2) {
          const [, options] = pluginConfig;
          pluginOptions = options;
        }
      }
    }
  });

  // support both commonjs and ES style exports
  const validateOptions =
    pluginModule.default?.validateOptions ?? pluginModule.validateOptions;
  if (validateOptions) {
    pluginOptions = validateOptions({
      validate: normalizePluginOptions,
      options: pluginOptions,
    });
  }

  // support both commonjs and ES style exports
  const plugin = pluginModule.default ?? pluginModule;
  const pluginInstance = await plugin(context, pluginOptions);
  const themePath = typescript
    ? pluginInstance.getTypeScriptThemePath?.()
    : pluginInstance.getThemePath?.();

  if (!themePath) {
    logger.warn(
      typescript
        ? logger.interpolate`name=${themeName} does not provide TypeScript theme code via ${'getTypeScriptThemePath()'}.`
        : logger.interpolate`name=${themeName} does not provide any theme code.`,
    );
    process.exit(1);
  }

  if (!componentName) {
    logger.info(themeComponents(themePath, pluginModule));
    return;
  }

  const components = getComponentName(themePath, pluginModule, Boolean(danger));
  const formattedComponentName = formatComponentName(componentName);
  const isComponentExists = components.find(
    (component) => component === formattedComponentName,
  );
  let mostSuitableComponent = componentName;

  if (!isComponentExists) {
    let mostSuitableMatch = componentName;
    let score = formattedComponentName.length;
    components.forEach((component) => {
      if (component.toLowerCase() === formattedComponentName.toLowerCase()) {
        // may be components with same lowercase key, try to match closest component
        const currentScore = leven(formattedComponentName, component);
        if (currentScore < score) {
          score = currentScore;
          mostSuitableMatch = component;
        }
      }
    });

    if (mostSuitableMatch !== componentName) {
      mostSuitableComponent = mostSuitableMatch;
      logger.error`Component name=${componentName} doesn't exist.`;
      logger.info`name=${mostSuitableComponent} is swizzled instead of name=${componentName}.`;
    }
  }

  let fromPath = path.join(themePath, mostSuitableComponent);
  let toPath = path.resolve(siteDir, THEME_PATH, mostSuitableComponent);
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
      let suggestion: string | undefined;
      components.forEach((name) => {
        if (leven(name, mostSuitableComponent) < 3) {
          suggestion = name;
        }
      });
      logger.error`Component name=${mostSuitableComponent} not found. ${
        suggestion
          ? logger.interpolate`Did you mean name=${suggestion} ?`
          : themeComponents(themePath, pluginModule)
      }`;
      process.exit(1);
    }
  }

  if (!components.includes(mostSuitableComponent) && !danger) {
    logger.error`name=${mostSuitableComponent} is an internal component and has a higher breaking change probability. If you want to swizzle it, use the code=${'--danger'} flag.`;
    process.exit(1);
  }

  await fs.copy(fromPath, toPath);

  logger.success`Copied code=${
    mostSuitableComponent ? `${themeName} ${mostSuitableComponent}` : themeName
  } to path=${path.relative(process.cwd(), toPath)}.`;
}
