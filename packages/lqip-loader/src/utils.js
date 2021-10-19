/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

const sortBy = require('lodash.sortby');

/**
 * toBase64
 * @description it returns a Base64 image string with required formatting
 * to work on the web (<img src=".." /> or in CSS url('..'))
 *
 * @param {string} extMimeType: image mime type string
 * @param data: base64 string
 * @returns {string}
 */
const toBase64 = (extMimeType, data) => {
  return `data:${extMimeType};base64,${data.toString('base64')}`;
};

/**
 * toPalette
 * @description takes a color swatch object, converts it to an array & returns
 * only hex color
 *
 * @param {import("node-vibrant/lib/color").Palette} swatch
 * @returns {string[]}
 */
const toPalette = (swatch) => {
  /** @type {Array<{popularity: number, hex: string}>} */
  let palette = Object.keys(swatch).reduce((result, key) => {
    if (swatch[key] !== null) {
      result.push({
        popularity: swatch[key].getPopulation(),
        hex: swatch[key].getHex(),
      });
    }
    return result;
  }, []);
  palette = sortBy(palette, ['popularity']);
  return palette.map((color) => color.hex).reverse();
};

module.exports = {
  toBase64,
  toPalette,
};
