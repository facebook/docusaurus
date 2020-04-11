/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Vibrant = require('node-vibrant');
const path = require('path');
const sharp = require('sharp');

const {version} = require('../package.json');
const {toPalette, toBase64} = require('./utils');

const ERROR_EXT = `Error: Input file is missing or uses unsupported image format, lqip v${version}`;

const SUPPORTED_MIMES = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
};

const base64 = (file) => {
  return new Promise((resolve, reject) => {
    let extension = path.extname(file) || '';
    extension = extension.split('.').pop();

    if (!SUPPORTED_MIMES[extension]) {
      return reject(ERROR_EXT);
    }

    return sharp(file)
      .resize(10)
      .toBuffer()
      .then((data) => {
        if (data) {
          return resolve(toBase64(SUPPORTED_MIMES[extension], data));
        }
        return reject(
          new Error('Unhandled promise rejection in base64 promise'),
        );
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

const palette = (file) => {
  return new Promise((resolve, reject) => {
    const vibrant = new Vibrant(file, {});
    vibrant
      .getPalette()
      .then((pal) => {
        if (pal) {
          return resolve(toPalette(pal));
        }
        return reject(
          new Error('Unhandled promise rejection in colorPalette', pal),
        );
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

process.on('unhandledRejection', (up) => {
  throw up;
});

module.exports = {
  base64,
  palette,
};
