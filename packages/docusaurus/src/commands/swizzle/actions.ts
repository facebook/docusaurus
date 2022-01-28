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
  typescript: boolean;
};

type ActionResult = {
  createdFiles: string[];
};

type ActionHandler = (params: ActionParams) => Promise<ActionResult>;

async function isDir(dirPath: string): Promise<boolean> {
  return (
    (await fs.pathExists(dirPath)) && (await fs.stat(dirPath)).isDirectory()
  );
}

export const eject: ActionHandler = async ({
  siteDir,
  themePath,
  componentName,
}) => {
  const fromPath = path.join(themePath, componentName);

  const isDirectory = await isDir(fromPath);

  const globIgnore = ['**/*.{story,stories,test,tests}.{js,jsx,ts,tsx}'];

  const globPattern = isDirectory
    ? // do we really want to copy all components?
      path.join(fromPath, '*')
    : `${fromPath}.*`;

  const filesToCopy = await Globby(globPattern, {
    ignore: globIgnore,
  });

  if (filesToCopy.length === 0) {
    // This should never happen
    throw new Error(logger.interpolate`No files to copy from path=${fromPath}`);
  }

  const toPath = isDirectory
    ? path.join(siteDir, THEME_PATH, componentName)
    : path.join(siteDir, THEME_PATH);

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
  componentName: themeComponentName,
  typescript,
}) => {
  const isDirectory = await isDir(path.join(themePath, themeComponentName));

  // Parent/ComponentName => ComponentName
  const componentName = themeComponentName.split('/').at(-1);
  const wrapperComponentName = `${componentName}Wrapper`;

  const wrapperFileName = `${themeComponentName}${isDirectory ? '/index' : ''}${
    typescript ? '.tsx' : '.js'
  }`;

  await fs.ensureDir(path.resolve(siteDir, THEME_PATH));

  const toPath = path.resolve(siteDir, THEME_PATH, wrapperFileName);

  const content = typescript
    ? `
import React, {ComponentProps} from 'react';
import ${componentName} from '@theme-original/${themeComponentName}';

type Props = ComponentProps<typeof ${componentName}>

export default function ${wrapperComponentName}(props: Props): JSX.Element {
  return (
    <>
      <${wrapperComponentName.split('/').at(-1)} {...props} />
    </>
  );
}`
    : `
import React from 'react';
import ${componentName} from '@theme-original/${themeComponentName}';

export default function ${wrapperComponentName}(props) {
  return (
    <>
      <${componentName} {...props} />
    </>
  );
}`;

  await fs.ensureDir(path.dirname(toPath));
  await fs.writeFile(toPath, content);

  return {createdFiles: [toPath]};
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
  if (!handler) {
    throw new Error(logger.interpolate`Action name=${action} is not supported`);
  }
  return handler(actionParams);
}
