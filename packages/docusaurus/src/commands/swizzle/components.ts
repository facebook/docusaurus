/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import type {
  SwizzleAction,
  SwizzleActionStatus,
  SwizzleComponentConfig,
  SwizzleConfig,
} from '@docusaurus/types';
import {posixPath} from '@docusaurus/utils';
import {askComponentName} from './prompts';
import {findClosestValue, findStringIgnoringCase} from './common';
import {helpTables, themeComponentsTable} from './tables';
import {SwizzleActions} from './actions';

export type ThemeComponents = {
  themeName: string;
  all: string[];
  getConfig: (component: string) => SwizzleComponentConfig;
  getDescription: (component: string) => string;
  getActionStatus: (
    component: string,
    action: SwizzleAction,
  ) => SwizzleActionStatus;
  isSafeAction: (component: string, action: SwizzleAction) => boolean;
  hasAnySafeAction: (component: string) => boolean;
  hasAllSafeAction: (component: string) => boolean;
};

const formatComponentName = (componentName: string): string =>
  componentName.replace(/[/\\]index\.[jt]sx?/, '').replace(/\.[jt]sx?/, '');

const skipReadDirNames = ['__test__', '__tests__', '__mocks__', '__fixtures__'];

export async function readComponentNames(themePath: string): Promise<string[]> {
  type File = {file: string; fullPath: string; isDir: boolean};
  type ComponentFile = File & {componentName: string};

  if (!(await fs.pathExists(themePath))) {
    return [];
  }

  async function walk(dir: string): Promise<ComponentFile[]> {
    const files: File[] = await Promise.all(
      (
        await fs.readdir(dir)
      ).flatMap(async (file) => {
        const fullPath = path.join(dir, file);
        const stat = await fs.stat(fullPath);
        const isDir = stat.isDirectory();
        return {file, fullPath, isDir};
      }),
    );

    return (
      await Promise.all(
        files.map(async (file) => {
          if (file.isDir) {
            if (skipReadDirNames.includes(file.file)) {
              return [];
            }
            return walk(file.fullPath);
          } else if (
            // TODO can probably be refactored
            /(?<!\.d)\.[jt]sx?$/.test(file.fullPath) &&
            !/(?<!\.d)\.(?:test|tests|story|stories)\.[jt]sx?$/.test(
              file.fullPath,
            )
          ) {
            const componentName = formatComponentName(
              posixPath(path.relative(themePath, file.fullPath)),
            );
            return [{...file, componentName}];
          }
          return [];
        }),
      )
    ).flat();
  }

  const componentFiles = await walk(themePath);

  const componentFilesOrdered = _.orderBy(
    componentFiles,
    [(f) => f.componentName],
    ['asc'],
  );

  return componentFilesOrdered.map((f) => f.componentName);
}

export function listComponentNames(themeComponents: ThemeComponents): string {
  if (themeComponents.all.length === 0) {
    return 'No component to swizzle.';
  }
  return `${themeComponentsTable(themeComponents)}

${helpTables()}
`;
}

export async function getThemeComponents({
  themeName,
  themePath,
  swizzleConfig,
}: {
  themeName: string;
  themePath: string;
  swizzleConfig: SwizzleConfig;
}): Promise<ThemeComponents> {
  const FallbackSwizzleActionStatus: SwizzleActionStatus = 'unsafe';
  const FallbackSwizzleComponentDescription = 'N/A';
  const FallbackSwizzleComponentConfig: SwizzleComponentConfig = {
    actions: {
      wrap: FallbackSwizzleActionStatus,
      eject: FallbackSwizzleActionStatus,
    },
    description: FallbackSwizzleComponentDescription,
  };

  const allComponents = await readComponentNames(themePath);

  function getConfig(component: string): SwizzleComponentConfig {
    if (!allComponents.includes(component)) {
      throw new Error(
        `Can't get component config: component doesn't exist: ${component}`,
      );
    }
    return (
      swizzleConfig.components[component] ?? FallbackSwizzleComponentConfig
    );
  }

  function getDescription(component: string): string {
    return (
      getConfig(component).description ?? FallbackSwizzleComponentDescription
    );
  }

  function getActionStatus(
    component: string,
    action: SwizzleAction,
  ): SwizzleActionStatus {
    return getConfig(component).actions[action] ?? FallbackSwizzleActionStatus;
  }

  function isSafeAction(component: string, action: SwizzleAction): boolean {
    return getActionStatus(component, action) === 'safe';
  }

  function hasAllSafeAction(component: string): boolean {
    return SwizzleActions.every((action) => isSafeAction(component, action));
  }

  function hasAnySafeAction(component: string): boolean {
    return SwizzleActions.some((action) => isSafeAction(component, action));
  }

  // Present the safest components first
  const orderedComponents = _.orderBy(
    allComponents,
    [
      hasAllSafeAction,
      (component) => isSafeAction(component, 'wrap'),
      (component) => isSafeAction(component, 'eject'),
      (component) => component,
    ],
    ['desc', 'desc', 'desc', 'asc'],
  );

  return {
    themeName,
    all: orderedComponents,
    getConfig,
    getDescription,
    getActionStatus,
    isSafeAction,
    hasAnySafeAction,
    hasAllSafeAction,
  };
}

// Returns a valid value if recovering is possible
function handleInvalidComponentNameParam({
  componentNameParam,
  themeComponents,
}: {
  componentNameParam: string;
  themeComponents: ThemeComponents;
}): string {
  // Trying to recover invalid value
  // We look for potential matches that only differ in casing.
  const differentCaseMatch = findStringIgnoringCase(
    componentNameParam,
    themeComponents.all,
  );
  if (differentCaseMatch) {
    logger.warn`Component name=${componentNameParam} doesn't exist.`;
    logger.info`name=${differentCaseMatch} will be used instead of name=${componentNameParam}.`;
    return differentCaseMatch;
  }

  // No recovery value is possible: print error
  logger.error`Component name=${componentNameParam} not found.`;
  const suggestion = findClosestValue(componentNameParam, themeComponents.all);
  if (suggestion) {
    logger.info`Did you mean name=${suggestion}? ${
      themeComponents.hasAnySafeAction(suggestion)
        ? `Note: this component is an unsafe internal component and can only be swizzled with code=${'--danger'} or explicit confirmation.`
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
  const isValidName = themeComponents.all.includes(componentNameParam);
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
}: {
  componentNameParam: string | undefined;
  themeComponents: ThemeComponents;
  list: boolean | undefined;
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

  return componentName;
}
