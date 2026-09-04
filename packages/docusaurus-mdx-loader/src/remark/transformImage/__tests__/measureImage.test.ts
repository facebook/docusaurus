/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {measureSvg} from '../measureImage';

describe('measureSvg', () => {
  it('reads width and height attributes', () => {
    const svg = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16"></svg>`,
    );
    expect(measureSvg(svg)).toEqual({width: 24, height: 16});
  });

  it('falls back to viewBox when width/height are percentages', () => {
    const svg = Buffer.from(
      `<svg viewBox="0 0 100 50" width="100%" height="100%"></svg>`,
    );
    expect(measureSvg(svg)).toEqual({width: 100, height: 50});
  });

  it('returns null for non-svg content', () => {
    expect(measureSvg(Buffer.from('not an image'))).toBeNull();
  });
});
