/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {base64} from '../lqip';

const resolveFixturePath = (name: string) =>
  path.join(__dirname, '__fixtures__', name);

const invalidPath = resolveFixturePath('docusaurus.svg');

describe('base64', () => {
  it('rejects unknown or unsupported file format', async () => {
    await expect(base64(invalidPath)).rejects.toThrow(
      /Error: Input file is missing or uses unsupported image format, lqip v.*/,
    );
  });

  it.each([
    ['endi.jpg', 'data:image/jpeg;base64,/9j/2wBDA'],
    // PNG's magic number (common to all PNGs)
    ['docusaurus.png', 'data:image/png;base64,iVBORw0KGgoA'],
    [
      'docusaurus.avif',
      // cspell:disable-next-line
      // AVIF's signature: \0\0\0\x1cftypavif\0\0\0\0avifmif1miaf
      'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZ',
    ],
  ] as [string, string][])(
    'generates a valid base64 for %s',
    async (imgName, expectedBase64) => {
      await expect(base64(resolveFixturePath(imgName))).resolves.toContain(
        expectedBase64,
      );
    },
  );

  it.each([
    [
      'docusaurus.webp',
      // WebP's magic number; expects size is less than 64kiB
      // cspell:disable-next-line
      /^data:image\/webp;base64,UklGR...AABXRUJQ/,
    ],
  ] as [string, RegExp][])(
    'generates a valid base64 for %s (using regexp)',
    async (imgName, expectedBase64) => {
      await expect(base64(resolveFixturePath(imgName))).resolves.toMatch(
        expectedBase64,
      );
    },
  );
});
