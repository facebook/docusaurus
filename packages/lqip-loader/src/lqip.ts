/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import Vibrant from 'node-vibrant';
import path from 'path';
import sharp from 'sharp';
import {toPalette, toBase64} from './utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {version} = require('../package.json');

const ERROR_EXT = `Error: Input file is missing or uses unsupported image format, lqip v${version}`;

const SUPPORTED_MIMES: Record<string, string> = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
};

export async function base64(file: string): Promise<string> {
  let extension = path.extname(file);
  extension = extension.split('.').pop()!;

  if (!SUPPORTED_MIMES[extension]) {
    throw new Error(ERROR_EXT);
  }

  try {
    const data = await sharp(file).resize(10).toBuffer();
    return toBase64(SUPPORTED_MIMES[extension], data);
  } catch (err) {
    logger.error`Generation of base64 failed for image path=${file}.`;
    throw err;
  }
}

export async function palette(file: string): Promise<string[]> {
  const vibrant = new Vibrant(file, {});
  try {
    const pal = await vibrant.getPalette();
    return toPalette(pal);
  } catch (err) {
    logger.error`Generation of color palette failed for image path=${file}.`;
    throw err;
  }
}
