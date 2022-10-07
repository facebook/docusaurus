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
  extends: '../../tsconfig.json',
  compilerOptions: Joi.alternatives().conditional(
    Joi.object({noEmit: true}).unknown(),
    {
      then: Joi.object({
        noEmit: Joi.valid(true).required(),
        incremental: Joi.forbidden(),
        tsBuildInfoFile: Joi.forbidden(),
        outDir: Joi.forbidden(),
      }).unknown(),
      otherwise: Joi.object({
        noEmit: Joi.valid(false).required(),
        incremental: Joi.valid(true).required(),
        rootDir: Joi.valid('src').required(),
        outDir: Joi.valid('lib').required(),
      }).unknown(),
    },
  ),
}).unknown();

describe('tsconfig files', () => {
  it('contain all required fields', async () => {
    const tsconfigFiles = await getTsconfigFiles();
    tsconfigFiles.forEach((file) => {
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
