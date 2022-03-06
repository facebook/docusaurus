/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import * as lqip from '../lqip';

describe('lqip library', () => {
  const imgPath = path.join(__dirname, '__fixtures__', 'endi.jpg');
  const invalidPath = path.join(__dirname, '__fixtures__', 'docusaurus.svg');

  it('should reject unknown or unsupported file format', async () => {
    await expect(lqip.base64(invalidPath)).rejects.toBeTruthy();
  });

  it('should generate a valid base64', async () => {
    const expectedBase64 = 'data:image/jpeg;base64,/9j/2wBDA';
    await expect(lqip.base64(imgPath)).resolves.toContain(expectedBase64);
  });

  it('should generate a valid color palette', async () => {
    const imgPalette = await lqip.palette(imgPath);
    expect(imgPalette).toHaveLength(6);
    expect(imgPalette).toContain('#578ca1');
  });
});
