/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import fs from 'fs-extra';
import path from 'path';
import type {
  SwizzleAction,
  SwizzleActionStatus,
  SwizzleComponentConfig,
  SwizzleConfig,
} from '@docusaurus/types';
import {orderBy} from 'lodash';
import {askComponentName, askSwizzleDangerousComponent} from './prompts';
import {findClosestValue, findStringIgnoringCase} from './common';
import {actionsTable, statusTable, themeComponentsTable} from './tables';
import {SwizzleActions} from './actions';
import {posixPath} from '@docusaurus/utils';

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
};

const formatComponentName = (componentName: string): string =>
  componentName
    .replace(/([/\\])index\.(js|tsx|ts|jsx)/, '')
    .replace(/\.(js|tsx|ts|jsx)/, '');

const skipReadDirNames = ['__test__', '__tests__', '__mocks__', '__fixtures__'];

export function readComponentNames(themePath: string): string[] {
  function walk(dir: string): string[] {
    return fs.readdirSync(dir).flatMap((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        if (skipReadDirNames.includes(file)) {
          return [];
        }
        return walk(fullPath);
      } else if (
        // TODO can probably be refactored
        /(?<!\.d)\.[jt]sx?$/.test(fullPath) &&
        !/(?<!\.d)\.(test|tests|story|stories)\.[jt]sx?$/.test(fullPath)
      ) {
        return [posixPath(fullPath)];
      } 
        return [];
      
    });
  }

  return walk(themePath).map((filePath) =>
    formatComponentName(path.relative(themePath, filePath)),
  );
}

export function listComponentNames(themeComponents: ThemeComponents): string {
  if (themeComponents.all.length === 0) {
    return 'No component to swizzle.';
  }
  return `

Components available for swizzle in ${logger.name(themeComponents.themeName)}:

${themeComponentsTable(themeComponents)}

${actionsTable()}
${statusTable()}
`;
}

export function getThemeComponents({
  themeName,
  themePath,
  swizzleConfig,
}: {
  themeName: string;
  themePath: string;
  swizzleConfig: SwizzleConfig;
}): ThemeComponents {
  const FallbackSwizzleActionStatus: SwizzleActionStatus = 'unsafe';

  const FallbackSwizzleComponentDescription = 'N/A';

  const FallbackSwizzleComponentConfig: SwizzleComponentConfig = {
    actions: {
      wrap: FallbackSwizzleActionStatus,
      eject: FallbackSwizzleActionStatus,
    },
    description: FallbackSwizzleComponentDescription,
  };

  const allComponents = readComponentNames(themePath);

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
  const orderedComponents = orderBy(
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

  if (!themeComponents.hasAnySafeAction(componentName) && !danger) {
    logger.warn`name=${componentName} is an unsafe internal component and has a higher breaking change probability. If you want to swizzle it, use the code=${'--danger'} flag, or confirm that you know what you are doing.`;
    const swizzleDangerousComponent = await askSwizzleDangerousComponent();
    if (!swizzleDangerousComponent) {
      return process.exit(1);
    }
  }

  return componentName;
}
