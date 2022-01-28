/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import fs from 'fs-extra';
import path from 'path';
import {Globby, THEME_PATH} from '@docusaurus/utils';
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
  createdFiles: string[];
};

type ActionHandler = (params: ActionParams) => Promise<ActionResult>;

export const eject: ActionHandler = async ({
  siteDir,
  themePath,
  componentName,
}) => {
  const fromPath = path.join(themePath, componentName);

  const isDirectory =
    (await fs.pathExists(fromPath)) && (await fs.stat(fromPath)).isDirectory();

  const globPattern = isDirectory
    ? path.join(fromPath, 'index.*')
    : `${fromPath}.*`;

  const filesToCopy = await Globby(globPattern, {
    ignore: ['**/*.{story,stories,test,tests}.{js,jsx,ts,tsx}'],
  });

  if (filesToCopy.length === 0) {
    // This should never happen
    throw new Error(logger.interpolate`No files to copy from path=${fromPath}`);
  }

  const toPath = isDirectory
    ? path.resolve(siteDir, THEME_PATH, componentName)
    : path.resolve(siteDir, THEME_PATH);

  await fs.ensureDir(toPath);

  async function copyFile(sourceFile: string) {
    const fileName = path.basename(sourceFile);
    const targetFile = path.join(toPath, fileName);
    try {
      await fs.copy(sourceFile, targetFile, {overwrite: true});
    } catch (err) {
      throw new Error(
        logger.interpolate`Could not copy file from ${sourceFile} to ${targetFile}`,
      );
    }
    return targetFile;
  }

  const createdFiles = await Promise.all(filesToCopy.map(copyFile));

  return {createdFiles};
};

export const wrap: ActionHandler = async ({
  siteDir,
  themePath,
  componentName,
}) => {
  const _fromPath = path.join(themePath, componentName);
  const _toPath = path.resolve(siteDir, THEME_PATH, componentName);

  // TODO handle wrapping here

  return {createdFiles: []};
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
