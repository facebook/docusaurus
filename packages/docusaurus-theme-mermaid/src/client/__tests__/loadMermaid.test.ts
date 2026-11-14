/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it, vi} from 'vitest';

const loadedModules = vi.hoisted(() => [] as string[]);

vi.mock('d3-transition', () => {
  loadedModules.push('d3-transition');
  return {};
});

vi.mock('mermaid', () => {
  loadedModules.push('mermaid');
  return {default: {}};
});

import {loadMermaid} from '../loadMermaid';

describe('loadMermaid', () => {
  it('loads d3-transition before Mermaid and keeps both imports lazy', async () => {
    expect(loadedModules).toEqual([]);

    await loadMermaid();

    expect(loadedModules).toEqual(['d3-transition', 'mermaid']);
  });
});
