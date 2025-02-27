/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import logger from '@docusaurus/logger';
import {Globby, posixPath, THEME_PATH} from '@docusaurus/utils';
import {askSwizzleAction} from './prompts';
import type {SwizzleAction, SwizzleComponentConfig} from '@docusaurus/types';
import type {SwizzleCLIOptions} from './common';

export const SwizzleActions: SwizzleAction[] = ['wrap', 'eject'];

export async function getAction(
  componentConfig: SwizzleComponentConfig,
  options: Pick<SwizzleCLIOptions, 'wrap' | 'eject'>,
): Promise<SwizzleAction> {
  if (options.wrap) {
    return 'wrap';
  }
  if (options.eject) {
    return 'eject';
  }
  return askSwizzleAction(componentConfig);
}

export type ActionParams = {
  siteDir: string;
  themePath: string;
  componentName: string;
  typescript: boolean;
};

export type ActionResult = {
  createdFiles: string[];
};

async function isDir(dirPath: string): Promise<boolean> {
  return (
    (await fs.pathExists(dirPath)) && (await fs.stat(dirPath)).isDirectory()
  );
}

export async function eject({
  siteDir,
  themePath,
  componentName,
  typescript,
}: ActionParams): Promise<ActionResult> {
  const fromPath = path.join(themePath, componentName);
  const isDirectory = await isDir(fromPath);
  const globPattern = isDirectory
    ? // Do we really want to copy all components?
      path.join(fromPath, '**/*')
    : `${fromPath}.*`;

  const globPatternPosix = posixPath(globPattern);

  const filesToCopy = await Globby(globPatternPosix, {
    ignore: _.compact([
      '**/*.{story,stories,test,tests}.{js,jsx,ts,tsx}',
      // When ejecting JS components, we want to avoid emitting TS files
      // In particular the .d.ts files that theme build output contains
      typescript ? null : '**/*.{d.ts,ts,tsx}',
      '**/{__fixtures__,__tests__}/*',
    ]),
  });

  if (filesToCopy.length === 0) {
    // This should never happen
    throw new Error(
      logger.interpolate`No files to copy from path=${fromPath} with glob code=${globPatternPosix}`,
    );
  }

  const toPath = path.join(siteDir, THEME_PATH);

  await fs.ensureDir(toPath);

  const createdFiles = await Promise.all(
    filesToCopy.map(async (sourceFile: string) => {
      const targetFile = path.join(
        toPath,
        path.relative(themePath, sourceFile),
      );
      try {
        const fileContents = await fs.readFile(sourceFile, 'utf-8');
        await fs.outputFile(
          targetFile,
          fileContents.trimStart().replace(/^\/\*.+?\*\/\s*/ms, ''),
        );
      } catch (err) {
        logger.error`Could not copy file from path=${sourceFile} to path=${targetFile}`;
        throw err;
      }
      return targetFile;
    }),
  );
  return {createdFiles};
}

export async function wrap({
  siteDir,
  themePath,
  componentName: themeComponentName,
  typescript,
  importType = 'original',
}: ActionParams & {
  importType?: 'original' | 'init';
}): Promise<ActionResult> {
  const isDirectory = await isDir(path.join(themePath, themeComponentName));

  // Top/Parent/ComponentName => ComponentName
  const componentName = _.last(themeComponentName.split('/'))!;
  const wrapperComponentName = `${componentName}Wrapper`;

  const wrapperFileName = `${themeComponentName}${isDirectory ? '/index' : ''}${
    typescript ? '.tsx' : '.js'
  }`;

  await fs.ensureDir(path.resolve(siteDir, THEME_PATH));

  const toPath = path.resolve(siteDir, THEME_PATH, wrapperFileName);

  const content = typescript
    ? `import React, {type ReactNode} from 'react';
import ${componentName} from '@theme-${importType}/${themeComponentName}';
import type ${componentName}Type from '@theme/${themeComponentName}';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof ${componentName}Type>;

export default function ${wrapperComponentName}(props: Props): ReactNode {
  return (
    <>
      <${componentName} {...props} />
    </>
  );
}
`
    : `import React from 'react';
import ${componentName} from '@theme-${importType}/${themeComponentName}';

export default function ${wrapperComponentName}(props) {
  return (
    <>
      <${componentName} {...props} />
    </>
  );
}
`;

  await fs.outputFile(toPath, content);

  return {createdFiles: [toPath]};
}
