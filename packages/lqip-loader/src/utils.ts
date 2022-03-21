/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import type {Palette} from 'node-vibrant/lib/color';

/**
 * it returns a Base64 image string with required formatting
 * to work on the web (<img src=".." /> or in CSS url('..'))
 */
export const toBase64 = (extMimeType: string, data: Buffer): string =>
  `data:${extMimeType};base64,${data.toString('base64')}`;

/**
 * takes a color swatch object, converts it to an array & returns
 * only hex color
 */
export const toPalette = (swatch: Palette): string[] => {
  let palette = Object.keys(swatch).reduce((result, key) => {
    if (swatch[key] !== null) {
      result.push({
        popularity: swatch[key]!.getPopulation(),
        hex: swatch[key]!.getHex(),
      });
    }
    return result;
  }, [] as {popularity: number; hex: string}[]);
  palette = _.sortBy(palette, ['popularity']);
  return palette.map((color) => color.hex).reverse();
};
