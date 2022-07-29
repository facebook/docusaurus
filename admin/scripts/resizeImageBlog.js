/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import logger from '@docusaurus/logger';
import sharp from 'sharp';
import imageSize from 'image-size';
import globby from 'globby';

// TODO duplicate temporary script: factorize!

const imgDir = 'website/blog/2022-08-01-announcing-docusaurus-2.0/img';

const imgWidth = 1200;

const allImages = (await globby(`${imgDir}/**`)).filter((file) =>
  ['.png', 'jpg', '.jpeg'].includes(path.extname(file)),
);

const [, , ...selectedImages] = process.argv;
const images = selectedImages.length > 0 ? selectedImages : allImages;

const stats = {
  skipped: 0,
  resized: 0,
};

await Promise.all(
  images.map(async (imgPath) => {
    const {width, height} = imageSize(imgPath);
    if (width === imgWidth && imgPath.endsWith('.png')) {
      // Do not emit if not resized. Important because we can't guarantee
      // idempotency during resize -> optimization
      stats.skipped += 1;
      return;
    }
    logger.info`Resized path=${imgPath}: Before number=${width}×number=${height}`;
    const data = await sharp(imgPath)
      .resize(imgWidth)
      .png({quality: 100})
      .toBuffer();
    await fs.writeFile(imgPath.replace(/jpe?g/, 'png'), data);
    stats.resized += 1;
  }),
);

console.log(`Blog images resizing complete.
${JSON.stringify(stats, null, 2)}`);
