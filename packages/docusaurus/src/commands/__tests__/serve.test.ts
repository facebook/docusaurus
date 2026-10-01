/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {looksLikeAsset} from '../serve';

describe('looksLikeAsset', () => {
  it('detects common asset extensions', () => {
    expect(looksLikeAsset('/img/logo.png')).toBe(true);
    expect(looksLikeAsset('/assets/main.css')).toBe(true);
    expect(looksLikeAsset('/assets/main.js')).toBe(true);
    expect(looksLikeAsset('/feed.xml')).toBe(true);
  });

  it('detects asset extensions longer than 4 chars', () => {
    expect(looksLikeAsset('/fonts/custom-font.woff2')).toBe(true);
    expect(looksLikeAsset('/site.webmanifest')).toBe(true);
    expect(looksLikeAsset('/data/points.geojson')).toBe(true);
  });

  it('detects assets requested with a search/hash suffix', () => {
    expect(looksLikeAsset('/img/logo.png?v=1')).toBe(true);
    expect(looksLikeAsset('/fonts/custom-font.woff2?v=abc123')).toBe(true);
    expect(looksLikeAsset('/img/logo.png#anchor')).toBe(true);
    expect(looksLikeAsset('/img/logo.png?v=1#anchor')).toBe(true);
  });

  it('does not detect pages as assets', () => {
    expect(looksLikeAsset('/')).toBe(false);
    expect(looksLikeAsset('/docs/intro')).toBe(false);
    expect(looksLikeAsset('/docs/intro/')).toBe(false);
    expect(looksLikeAsset('/blog/2024/01/01/hello')).toBe(false);
    expect(looksLikeAsset('/search?q=hello')).toBe(false);
    expect(looksLikeAsset('/docs/intro#section')).toBe(false);
  });
});
