/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import {Globby} from '@docusaurus/utils';
import {Joi} from '@docusaurus/utils-validation';

type TsconfigFile = {
  file: string;
  content: {
    extends?: string;
    compilerOptions: {
      [key: string]: unknown;
    };
  };
};

async function getTsconfigFiles(): Promise<TsconfigFile[]> {
  const files = await Globby('packages/*/tsconfig.*');
  return Promise.all(
    files.map((file) =>
      fs
        .readJSON(file)
        .then((content: TsconfigFile['content']) => ({file, content})),
    ),
  );
}

const tsconfigSchema = Joi.object({
  extends: Joi.valid(
    '../../tsconfig.base.json',
    '../../tsconfig.base.client.json',
  ),
  compilerOptions: Joi.object({
    rootDir: Joi.valid('src').required(),
    outDir: Joi.valid('lib').required(),
    tsBuildInfoFile: Joi.valid(
      'lib/.tsbuildinfo',
      'lib/.tsbuildinfo-client',
      'lib/.tsbuildinfo-worker',
    ),
  }).unknown(),
}).unknown();

describe('tsconfig files', () => {
  it('contain all required fields', async () => {
    const tsconfigFiles = await getTsconfigFiles();

    tsconfigFiles
      // Ignore noEmit configs
      .filter((file) => !(file.content.compilerOptions!.noEmit === true))
      .forEach((file) => {
        try {
          Joi.attempt(file.content, tsconfigSchema);
        } catch (e) {
          (
            e as Error
          ).message += `\n${file.file} does not match the required schema.`;
          throw e;
        }
      });
  });
});
