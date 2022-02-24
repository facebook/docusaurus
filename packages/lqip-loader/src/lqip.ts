/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
  let extension = path.extname(file) || '';
  extension = extension.split('.').pop()!;

  if (!SUPPORTED_MIMES[extension]) {
    throw new Error(ERROR_EXT);
  }

  const data = await sharp(file).resize(10).toBuffer();
  if (data) {
    return toBase64(SUPPORTED_MIMES[extension], data);
  }
  throw new Error('Unhandled promise rejection in base64 promise');
}

export async function palette(file: string): Promise<string[]> {
  const vibrant = new Vibrant(file, {});
  const pal = await vibrant.getPalette();
  if (pal) {
    return toPalette(pal);
  }
  throw new Error(`Unhandled promise rejection in colorPalette ${pal}`);
}

process.on('unhandledRejection', (up) => {
  throw up;
});
