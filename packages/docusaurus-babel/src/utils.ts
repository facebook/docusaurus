/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {BABEL_CONFIG_FILE_NAME} from '@docusaurus/utils';
import type {TransformOptions} from '@babel/core';

export async function getCustomBabelConfigFilePath(
  siteDir: string,
): Promise<string | undefined> {
  const customBabelConfigurationPath = path.join(
    siteDir,
    BABEL_CONFIG_FILE_NAME,
  );
  return (await fs.pathExists(customBabelConfigurationPath))
    ? customBabelConfigurationPath
    : undefined;
}

export function getBabelOptions({
  isServer,
  babelOptions,
}: {
  isServer?: boolean;
  // TODO Docusaurus v4 fix this
  //  weird to have getBabelOptions take a babelOptions param
  babelOptions?: TransformOptions | string;
} = {}): TransformOptions {
  const caller = {name: isServer ? 'server' : 'client'};
  if (typeof babelOptions === 'string') {
    return {
      babelrc: false,
      configFile: babelOptions,
      caller,
    };
  }
  return {
    ...(babelOptions ?? {
      presets: [require.resolve('@docusaurus/babel/preset')],
    }),
    babelrc: false,
    configFile: false,
    caller,
  };
}
