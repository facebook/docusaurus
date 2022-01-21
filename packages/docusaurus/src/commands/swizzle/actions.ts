/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import fs from 'fs-extra';
import path from 'path';
import {THEME_PATH} from '@docusaurus/utils';
import type {SwizzleAction, SwizzleComponentConfig} from '@docusaurus/types';
import type {SwizzleOptions} from './common';
import {askSwizzleAction} from './prompts';

export const SwizzleActions: SwizzleAction[] = ['wrap', 'eject'];

export async function getAction(
  componentConfig: SwizzleComponentConfig,
  options: Pick<SwizzleOptions, 'wrap' | 'eject'>,
): Promise<SwizzleAction> {
  if (options.wrap) {
    return 'wrap';
  }
  if (options.eject) {
    return 'eject';
  }
  return askSwizzleAction(componentConfig);
}

type ActionParams = {
  siteDir: string;
  themePath: string;
  componentName: string;
};

type ActionResult = {
  from: string;
  to: string;
};

type ActionHandler = (params: ActionParams) => Promise<ActionResult>;

export const eject: ActionHandler = async ({
  siteDir,
  themePath,
  componentName,
}) => {
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
};

export const wrap: ActionHandler = async ({
  siteDir,
  themePath,
  componentName,
}) => {
  const fromPath = path.join(themePath, componentName);
  const toPath = path.resolve(siteDir, THEME_PATH, componentName);

  // TODO handle wrapping here

  return {from: fromPath, to: toPath};
};

const ActionHandlers: Record<SwizzleAction, ActionHandler> = {
  eject,
  wrap,
};

export async function executeAction({
  action,
  ...actionParams
}: {action: SwizzleAction} & ActionParams): Promise<ActionResult> {
  const handler = ActionHandlers[action];
  return handler(actionParams);
}
