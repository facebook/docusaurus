/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it, vi} from 'vitest';
import {normalizeGitRelativePath} from '../vcsGitEager';

describe('normalizeGitRelativePath', () => {
  it('keeps regular relative paths unchanged', () => {
    const oldPlatform = process.platform;
    vi.spyOn(process, 'platform', 'get').mockReturnValue('win32');
    expect(normalizeGitRelativePath('docs/intro.md')).toBe('docs/intro.md');
    vi.spyOn(process, 'platform', 'get').mockReturnValue(oldPlatform);
  });

  it('drops MSYS drive prefixes on Windows', () => {
    const oldPlatform = process.platform;
    vi.spyOn(process, 'platform', 'get').mockReturnValue('win32');
    expect(normalizeGitRelativePath('/p/projets/my-repo')).toBe(
      'projets/my-repo',
    );
    vi.spyOn(process, 'platform', 'get').mockReturnValue(oldPlatform);
  });
});
