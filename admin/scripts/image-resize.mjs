/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const images = (
  await fs.readdir(new URL('../../website/src/data/showcase', import.meta.url))
).filter((file) => ['.png', 'jpg', '.jpeg'].includes(path.extname(file)));

await Promise.all(
  images.map(async (img) => {
    const imgPath = new URL(
      `../../website/src/data/showcase/${img}`,
      import.meta.url,
    ).pathname;
    const data = await sharp(imgPath)
      .resize(640, 320, {fit: 'cover', position: 'top'})
      .png()
      .toBuffer();
    await fs.writeFile(imgPath.replace(/jpe?g/, 'png'), data);
  }),
);

// You should also run optimizt `find website/src/data/showcase -type f -name '*.png'`.
// This is not included here because @funboxteam/optimizt doesn't seem to play well with M1
// so I had to run this in a Rosetta terminal.
// TODO integrate this as part of the script
