/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import Vibrant from 'node-vibrant';

// @ts-ignore
import {toPalette, toBase64, toPropertyString} from '../utils';
// @ts-ignore
import lqip from '../lqip';

describe('lqip-loader', () => {
  describe('toBase64', () => {
    test('should return a properly formatted Base64 image string', () => {
      const expected = 'data:image/jpeg;base64,hello world';
      const mockedMimeType = 'image/jpeg';
      const mockedBase64Data = 'hello world';
      expect(toBase64(mockedMimeType, mockedBase64Data)).toEqual(expected);
    });
  });

  describe('toPalette', () => {
    let correctTestSwatch: object = {};
    let testSwatchWithNull: object = {};

    beforeAll(() => {
      const imgPath = path.join(__dirname, '__fixtures__', 'endi.jpg');
      const vibrant = new Vibrant(imgPath, {});

      return vibrant.getPalette().then((palette) => {
        correctTestSwatch = Object.assign({}, palette);
        testSwatchWithNull = Object.assign({}, palette, {Vibrant: null});
      });
    });

    it('should return 6 hex colours sorted by popularity', () => {
      expect(toPalette(correctTestSwatch)).toHaveLength(6);
    });

    it('should return 5 hex colours with no errors if a palette was incomplete', () => {
      expect(toPalette(testSwatchWithNull)).toHaveLength(5);
    });
  });

  describe('lqip library', () => {
    const imgPath = path.join(__dirname, '__fixtures__', 'endi.jpg');
    const invalidPath = path.join(__dirname, '__fixtures__', 'docusaurus.svg');

    it('should reject unknown or unsupported file format', () => {
      expect(lqip.base64(invalidPath)).rejects.toBeTruthy();
    });

    it('should generate a valid base64', () => {
      const expectedBase64 = 'data:image/jpeg;base64,/9j/2wBDA';
      lqip.base64(imgPath).then((base64: string) => {
        expect(base64).toContain(expectedBase64);
      });
    });

    it('should generate a valid color palette', () => {
      lqip.palette(imgPath).then((imgPalette: string[]) => {
        expect(imgPalette).toHaveLength(6);
        expect(imgPalette).toContain('#578ca1');
      });
    });
  });
});
