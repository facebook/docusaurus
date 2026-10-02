/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import fs from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {isInsidePnpmWorkspace, siteNameToPackageName} from '../utils';

describe('siteNameToPackageName', () => {
  it('converts simple cases', () => {
    const testCases: [string, string][] = [
      ['Foo Bar', 'foo-bar'],
      ['fooBar', 'foo-bar'],
      ['__FOO_BAR__', 'foo-bar'],
      ['XMLHttpRequest', 'xml-http-request'],
      ['sitemapXML', 'sitemap-xml'],
      ['XMLHttp', 'xml-http'],
      ['xml-http', 'xml-http'],
    ];

    testCases.forEach(([input, expected]) => {
      expect(siteNameToPackageName(input)).toEqual(expected);
    });
  });

  it('converts ñ', () => {
    expect(siteNameToPackageName('mañanaFoo')).toEqual('ma-ana-foo');
  });

  it('converts __', () => {
    expect(siteNameToPackageName('foo__bar')).toEqual('foo-bar');
  });

  it('skips 🔥', () => {
    expect(siteNameToPackageName('🔥')).toEqual('🔥');
  });

  it('skips !!!', () => {
    expect(siteNameToPackageName('!!!')).toEqual('!!!');
  });
});

describe('isInsidePnpmWorkspace', () => {
  async function createTmpDir() {
    return fs.mkdtempDisposable(
      path.join(await fs.realpath(tmpdir()), 'docusaurus-tmp-'),
    );
  }

  it('returns true when a parent dir has a pnpm-workspace.yaml file', async () => {
    await using tmpDir = await createTmpDir();
    await fs.writeFile(path.join(tmpDir.path, 'pnpm-workspace.yaml'), '');
    const siteDir = path.join(tmpDir.path, 'apps', 'site');
    await fs.mkdir(siteDir, {recursive: true});
    await expect(isInsidePnpmWorkspace(siteDir)).resolves.toBe(true);
  });

  it('ignores the pnpm-workspace.yaml file of the dir itself', async () => {
    await using tmpDir = await createTmpDir();
    const siteDir = path.join(tmpDir.path, 'site');
    await fs.mkdir(siteDir);
    await fs.writeFile(path.join(siteDir, 'pnpm-workspace.yaml'), '');
    await expect(isInsidePnpmWorkspace(siteDir)).resolves.toBe(false);
  });
});
