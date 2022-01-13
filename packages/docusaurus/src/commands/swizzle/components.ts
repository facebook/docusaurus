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
import type {ImportedPluginModule} from '@docusaurus/types';
import {partition} from 'lodash';
import {askComponentName, askSwizzleDangerousComponent} from './prompts';
import {findClosestValue, findStringIgnoringCase} from './utils';
import {THEME_PATH} from '@docusaurus/utils';

export type ThemeComponents = {
  allComponents: string[];
  safeComponents: string[];
};

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

export function listComponentNames(themeComponents: ThemeComponents): string {
  const {safeComponents, allComponents} = themeComponents;
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

export function getThemeComponents({
  themeName,
  themePath,
}: {
  themeName: string;
  themePath: string;
}): ThemeComponents {
  const pluginModule = importFresh<ImportedPluginModule>(themeName);
  const getSwizzleComponentList =
    pluginModule.default?.getSwizzleComponentList ??
    pluginModule.getSwizzleComponentList;
  const allComponents = readComponentNames(themePath);
  const safeComponents = getSwizzleComponentList
    ? getSwizzleComponentList() ?? allComponents
    : [];

  return {allComponents, safeComponents};
}

// Returns a valid value if recovering is possible
function handleInvalidComponentNameParam({
  componentNameParam,
  themeComponents,
}: {
  componentNameParam: string;
  themeComponents: ThemeComponents;
}): string {
  const {allComponents, safeComponents} = themeComponents;

  // Trying to recover invalid value
  // We look for potential matches that only differ in casing.
  const differentCaseMatch = findStringIgnoringCase(
    componentNameParam,
    allComponents,
  );
  if (differentCaseMatch) {
    logger.warn`Component name=${componentNameParam} doesn't exist.`;
    logger.info`name=${differentCaseMatch} will be used instead of name=${componentNameParam}.`;
    return differentCaseMatch;
  }

  // No recovery value is possible: print error
  logger.error`Component name=${componentNameParam} not found.`;
  const suggestion = findClosestValue(componentNameParam, allComponents);
  if (suggestion) {
    logger.info`Did you mean name=${suggestion}? ${
      safeComponents.includes(suggestion)
        ? `Note: this component is an internal component and can only be swizzled with code=${'--danger'}.`
        : ''
    }`;
  } else {
    logger.info(listComponentNames(themeComponents));
  }
  return process.exit(1);
}

async function handleComponentNameParam({
  componentNameParam,
  themeComponents,
}: {
  componentNameParam: string;
  themeComponents: ThemeComponents;
}): Promise<string> {
  const isValidName =
    themeComponents.allComponents.includes(componentNameParam);
  if (!isValidName) {
    return handleInvalidComponentNameParam({
      componentNameParam,
      themeComponents,
    });
  }
  return componentNameParam;
}

export async function getComponentName({
  componentNameParam,
  themeComponents,
  list,
  danger,
}: {
  componentNameParam: string | undefined;
  themeComponents: ThemeComponents;
  list: boolean | undefined;
  danger: boolean | undefined;
}): Promise<string> {
  if (list) {
    logger.info(listComponentNames(themeComponents));
    return process.exit(0);
  }
  const componentName: string = componentNameParam
    ? await handleComponentNameParam({
        componentNameParam,
        themeComponents,
      })
    : await askComponentName(themeComponents);

  const isSafe = themeComponents.safeComponents.includes(componentName);

  if (!isSafe && !danger) {
    logger.warn`name=${componentName} is an internal component and has a higher breaking change probability. If you want to swizzle it, use the code=${'--danger'} flag.`;
    const swizzleDangerousComponent = await askSwizzleDangerousComponent();
    if (!swizzleDangerousComponent) {
      return process.exit(1);
    }
  }

  return componentName;
}

export async function copyThemeComponent({
  siteDir,
  themePath,
  componentName,
}: {
  siteDir: string;
  themePath: string;
  componentName: string;
}): Promise<{from: string; to: string}> {
  let fromPath = path.join(themePath, componentName);
  let toPath = path.resolve(siteDir, THEME_PATH, componentName);
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
    } else {
      throw new Error(
        logger.interpolate`Unexpected, can't copy theme component from path=${fromPath}`,
      );
    }
  }

  // TODO do not copy subfolders?
  await fs.copy(fromPath, toPath);

  return {from: fromPath, to: toPath};
}
