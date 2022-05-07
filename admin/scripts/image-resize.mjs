/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import imageSize from 'image-size';
import {fileURLToPath} from 'url';
import logger from '@docusaurus/logger';

const allImages = (
  await fs.readdir(new URL('../../website/src/data/showcase', import.meta.url))
).filter((file) => ['.png', 'jpg', '.jpeg'].includes(path.extname(file)));

const [, , ...selectedImages] = process.argv;
const images = selectedImages.length > 0 ? selectedImages : allImages;

await Promise.all(
  images.map(async (img) => {
    const imgPath = fileURLToPath(
      new URL(`../../website/src/data/showcase/${img}`, import.meta.url),
    );
    const {width, height} = imageSize(imgPath);
    if (width === 640 && height === 320 && imgPath.endsWith('.png')) {
      // Do not emit if not resized. Important because we can't guarantee
      // idempotency during resize -> optimization
      return;
    }
    logger.info`Resized path=${imgPath}: Before number=${width}×number=${height}`;
    const data = await sharp(imgPath)
      .resize(640, 320, {fit: 'cover', position: 'top'})
      .png()
      .toBuffer();
    await fs.writeFile(imgPath.replace(/jpe?g/, 'png'), data);
  }),
);

// You should also run
// optimizt `find website/src/data/showcase -type f -name '*.png'`.
// This is not included here because @funboxteam/optimizt doesn't seem to play
// well with M1 so I had to run this in a Rosetta terminal.
// TODO integrate this as part of the script
