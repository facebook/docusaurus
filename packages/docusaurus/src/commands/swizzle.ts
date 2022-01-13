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
import type {ImportedPluginModule, InitializedPlugin} from '@docusaurus/types';
import leven from 'leven';
import {orderBy, partition, uniq} from 'lodash';
import {THEME_PATH} from '@docusaurus/utils';
import {loadContext, loadPluginConfigs} from '../server';
import initPlugins from '../server/plugins/init';
import prompts from 'prompts';

const formatComponentName = (componentName: string): string =>
  componentName
    .replace(/(\/|\\)index\.(js|tsx|ts|jsx)/, '')
    .replace(/\.(js|tsx|ts|jsx)/, '');

function readComponentNames(themePath: string) {
  function walk(dir: string): string[] {
    return fs.readdirSync(dir).flatMap((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        return walk(fullPath);
      } else if (/(?<!\.d)\.[jt]sx?$/.test(fullPath)) {
        return [fullPath];
      } else {
        return [];
      }
    });
  }

  return walk(themePath).map((filePath) =>
    formatComponentName(path.relative(themePath, filePath)),
  );
}

function listComponentNames(
  safeComponents: string[],
  allComponents: string[],
): string {
  if (allComponents.length === 0) {
    return 'No component to swizzle.';
  }
  const [greenComponents, redComponents] = partition(allComponents, (comp) =>
    safeComponents.includes(comp),
  );

  const componentList = [
    ...greenComponents.map(
      (component) => `${logger.green(logger.bold('safe:'))}   ${component}`,
    ),
    ...redComponents.map(
      (component) => `${logger.red(logger.bold('unsafe:'))} ${component}`,
    ),
  ];

  return `Theme components available for swizzle.

${logger.green(logger.bold('green  =>'))} safe: lower breaking change risk
${logger.red(logger.bold('red    =>'))} unsafe: higher breaking change risk

${componentList.join('\n')}
`;
}

type Options = {
  typescript?: boolean;
  danger?: boolean;
  list?: boolean;
};

function getThemeNames(plugins: InitializedPlugin[]): string[] {
  const themeNames = uniq(
    // The fact that getThemePath is attached to the plugin instance makes
    // this code impossible to optimize. If this is a static method, we don't
    // need to initialize all plugins just to filter which are themes
    // Benchmark: loadContext-58ms; initPlugins-323ms
    plugins
      .filter(
        (plugin) => plugin.getThemePath && plugin.version.type === 'package',
      )
      .map((plugin) => (plugin.version as {name: string}).name),
  );

  // Opinionated ordering: user is most likely to swizzle:
  // - the classic theme
  // - official themes
  // - official plugins
  return orderBy(
    themeNames,
    [
      (t) => t === '@docusaurus/theme-classic',
      (t) => t.includes('@docusaurus/theme'),
      (t) => t.includes('@docusaurus'),
    ],
    ['desc', 'desc', 'desc'],
  );
}

export default async function swizzle(
  siteDir: string,
  themeName: string | undefined,
  componentName: string | undefined,
  {typescript, danger, list}: Options,
): Promise<void> {
  const context = await loadContext(siteDir);
  const pluginConfigs = loadPluginConfigs(context);
  const plugins = await initPlugins({pluginConfigs, context});
  const themeNames = getThemeNames(plugins);
  if (!themeName) {
    if (list) {
      logger.info`Themes available for swizzle: name=${themeNames}`;
      return;
    } else {
      // eslint-disable-next-line no-param-reassign
      ({themeName} = await prompts({
        type: 'select',
        name: 'themeName',
        message: 'Select a theme to swizzle:',
        choices: themeNames
          .map((theme) => ({title: theme, value: theme}))
          .concat({title: '[Exit]', value: '[Exit]'}),
      }));
      if (!themeName || themeName === '[Exit]') {
        return;
      }
    }
  }
  // themeNames are all the valid themes: importing them would always succeed
  // since we already tried importing them when loading plugin configs.
  if (!themeNames.includes(themeName)) {
    const suggestion = themeNames.find((name) => leven(name, themeName!) < 4);
    logger.error`Theme name=${themeName} not found. ${
      suggestion
        ? logger.interpolate`Did you mean name=${suggestion}?`
        : logger.interpolate`Themes available for swizzle: ${themeNames}`
    }`;
    process.exitCode = 1;
    return;
  }

  // Attaching getThemePath to the plugin instance means it is possible for a
  // plugin to return different paths given different options. Maybe we need to
  // pass in a plugin ID to decide which plugin to load?
  const pluginInstance = plugins.find(
    (plugin) =>
      plugin.version.type === 'package' && plugin.version.name === themeName,
  )!;
  const themePath = typescript
    ? pluginInstance.getTypeScriptThemePath?.()
    : pluginInstance.getThemePath?.();
  if (!themePath) {
    logger.warn(
      typescript
        ? logger.interpolate`name=${themeName} does not provide TypeScript theme code via ${'getTypeScriptThemePath()'}.`
        : // This is... technically possible to happen, e.g. returning undefined
          // from getThemePath. Plugins may intentionally or unintentionally
          // disguise as themes?
          logger.interpolate`name=${themeName} does not provide any theme code.`,
    );
    process.exitCode = 1;
    return;
  }

  const pluginModule = importFresh<ImportedPluginModule>(themeName);
  const getSwizzleComponentList =
    pluginModule.default?.getSwizzleComponentList ??
    pluginModule.getSwizzleComponentList;
  const allComponents = readComponentNames(themePath);
  const safeComponents = getSwizzleComponentList
    ? getSwizzleComponentList() ?? allComponents
    : [];
  if (safeComponents.length === 0 && !danger) {
    logger.warn`name=${themeName} doesn't declare any component as safe for swizzle. Make sure you are using the code=${'--danger'} flag.`;
    return;
  }
  if (!componentName) {
    if (list) {
      logger.info(listComponentNames(safeComponents, allComponents));
      return;
    } else {
      // eslint-disable-next-line no-param-reassign
      ({componentName} = await prompts({
        type: 'autocomplete',
        name: 'componentName',
        message: 'Select or type the component to swizzle:',
        choices: allComponents
          .map((comp) => ({
            title: comp,
            value: comp,
          }))
          .concat({title: '[Exit]', value: '[Exit]'}),
        async suggest(input, choices) {
          return choices.filter((choice) =>
            choice.title.toLowerCase().includes(input.toLowerCase()),
          );
        },
      }));
      if (!componentName || componentName === '[Exit]') {
        return;
      }
    }
  }

  let componentCandidate = allComponents.find((comp) => comp === componentName);
  if (!componentCandidate) {
    // We look for potential matches that only differ in casing.
    const match = allComponents.find(
      (comp) => comp.toLowerCase() === componentName!.toLowerCase(),
    );
    if (match) {
      componentCandidate = match;
      logger.warn`Component name=${componentName} doesn't exist.`;
      logger.info`name=${componentCandidate} is swizzled instead of name=${componentName}.`;
    } else {
      // We didn't find any component that only differ in casing.
      const suggestion = allComponents.find(
        (comp) => leven(comp, componentName!) < 3,
      );
      logger.error`Component name=${componentName} not found.`;
      if (suggestion) {
        logger.info`Did you mean name=${suggestion}? ${
          safeComponents.includes(suggestion)
            ? `Note: this component is an internal component and can only be swizzled with code=${'--danger'}.`
            : ''
        }`;
      } else {
        logger.info(listComponentNames(safeComponents, allComponents));
      }
      process.exitCode = 1;
      return;
    }
  }

  if (
    !safeComponents.includes(componentCandidate) &&
    allComponents.includes(componentCandidate) &&
    !danger
  ) {
    logger.error`name=${componentCandidate} is an internal component and has a higher breaking change probability. If you want to swizzle it, use the code=${'--danger'} flag.`;
    process.exitCode = 1;
    return;
  }

  let fromPath = path.join(themePath, componentCandidate);
  let toPath = path.resolve(siteDir, THEME_PATH, componentCandidate);
  // Handle single TypeScript/JavaScript file only.
  // E.g: if <fromPath> does not exist, we try to swizzle <fromPath>.(ts|tsx|js) instead
  if (!fs.existsSync(fromPath)) {
    if (fs.existsSync(`${fromPath}.ts`)) {
      [fromPath, toPath] = [`${fromPath}.ts`, `${toPath}.ts`];
    } else if (fs.existsSync(`${fromPath}.tsx`)) {
      [fromPath, toPath] = [`${fromPath}.tsx`, `${toPath}.tsx`];
    } else if (fs.existsSync(`${fromPath}.js`)) {
      [fromPath, toPath] = [`${fromPath}.js`, `${toPath}.js`];
    } else if (fs.existsSync(`${fromPath}.jsx`)) {
      [fromPath, toPath] = [`${fromPath}.jsx`, `${toPath}.jsx`];
    }
  }

  await fs.copy(fromPath, toPath);

  logger.success`Copied code=${`${themeName} ${componentCandidate}`} to path=${path.relative(
    process.cwd(),
    toPath,
  )}.`;
}
