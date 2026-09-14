/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import path from 'path';
import {
  getVersionDocsDirPath,
  getVersionSidebarsPath,
  getVersionedContentRoot,
} from '../files';

describe('versioned docs path helpers', () => {
  const siteDir = path.join(__dirname, 'site');

  it('getVersionedContentRoot defaults to siteDir', () => {
    expect(getVersionedContentRoot(siteDir, undefined)).toBe(siteDir);
  });

  it('getVersionedContentRoot resolves relative path from siteDir', () => {
    expect(getVersionedContentRoot(siteDir, '../my-versions')).toBe(
      path.resolve(siteDir, '../my-versions'),
    );
  });

  it('getVersionDocsDirPath uses versionedDocsPath when provided', () => {
    expect(
      getVersionDocsDirPath(siteDir, 'default', '1.0.0', '../my-versions'),
    ).toBe(
      path.join(
        path.resolve(siteDir, '../my-versions'),
        'versioned_docs',
        'version-1.0.0',
      ),
    );
  });

  it('getVersionDocsDirPath prefixes non-default plugin id', () => {
    expect(
      getVersionDocsDirPath(siteDir, 'community', '2.0.0', './versions'),
    ).toBe(
      path.join(
        path.resolve(siteDir, './versions'),
        'community_versioned_docs',
        'version-2.0.0',
      ),
    );
  });

  it('getVersionSidebarsPath uses versionedDocsPath when provided', () => {
    expect(
      getVersionSidebarsPath(siteDir, 'default', '1.0.0', '../my-versions'),
    ).toBe(
      path.join(
        path.resolve(siteDir, '../my-versions'),
        'versioned_sidebars',
        'version-1.0.0-sidebars.json',
      ),
    );
  });
});
