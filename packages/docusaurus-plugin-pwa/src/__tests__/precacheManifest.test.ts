/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {injectManifest, type ManifestEntry} from 'workbox-build';
import {injectPrecacheManifest} from '../precacheManifest';

const SwSource = 'const manifest = self.__WB_MANIFEST;';

async function createOutDir() {
  const dir = await fs.mkdtempDisposable(
    path.join(await fs.realpath(tmpdir()), 'docusaurus-pwa-'),
  );
  await fs.mkdir(path.join(dir.path, 'assets'));
  await fs.writeFile(path.join(dir.path, 'index.html'), '<h1>Home</h1>');
  await fs.writeFile(path.join(dir.path, 'assets/main.css'), 'body{}');
  await fs.writeFile(path.join(dir.path, 'assets/main.js'), 'alert(1)');
  await fs.writeFile(path.join(dir.path, 'sw.js'), SwSource);
  return dir;
}

async function readSwManifest(outDir: string): Promise<ManifestEntry[]> {
  const swContent = await fs.readFile(path.join(outDir, 'sw.js'), 'utf8');
  const manifestJson = /^const manifest = (?<json>.*);$/.exec(swContent)!
    .groups!.json!;
  return JSON.parse(manifestJson);
}

function getOptions(outDir: string) {
  const swFile = path.join(outDir, 'sw.js');
  return {
    globDirectory: outDir,
    globPatterns: ['**/*.{html,css,js}'],
    swSrc: swFile,
    swDest: swFile,
  };
}

describe('injectPrecacheManifest', () => {
  it('injects the same manifest as Workbox', async () => {
    await using workboxOutDir = await createOutDir();
    await using outDir = await createOutDir();

    await injectManifest(getOptions(workboxOutDir.path));
    await injectPrecacheManifest(getOptions(outDir.path));

    const workboxManifest = await readSwManifest(workboxOutDir.path);
    await expect(readSwManifest(outDir.path)).resolves.toEqual(
      workboxManifest.toSorted((a, b) => a.url.localeCompare(b.url)),
    );
  });

  it('injects files hashed with MD5, except the service worker', async () => {
    await using outDir = await createOutDir();

    await injectPrecacheManifest(getOptions(outDir.path));

    await expect(readSwManifest(outDir.path)).resolves.toEqual([
      {url: 'assets/main.css', revision: 'aa676972bbd2b68e94ef8e91e81d20be'},
      {url: 'assets/main.js', revision: '238e96d5b62a1aec3739730469f27192'},
      {url: 'index.html', revision: 'fe919dfbe925337c176e602ebbf0d15c'},
    ]);
  });

  it('delegates templatedURLs to Workbox', async () => {
    await using outDir = await createOutDir();

    await injectPrecacheManifest({
      ...getOptions(outDir.path),
      templatedURLs: {'/app-shell': 'shell'},
    });

    await expect(readSwManifest(outDir.path)).resolves.toContainEqual({
      url: '/app-shell',
      revision: crypto.createHash('md5').update('shell').digest('hex'),
    });
  });

  it('applies the Workbox manifest options', async () => {
    await using outDir = await createOutDir();

    await injectPrecacheManifest({
      ...getOptions(outDir.path),
      globIgnores: ['**/*.css'],
      maximumFileSizeToCacheInBytes: 10,
      modifyURLPrefix: {'assets/': 'static/'},
      dontCacheBustURLsMatching: /main\.js$/,
      manifestTransforms: [
        (manifest) => ({
          manifest: manifest.map((entry) => ({...entry, url: `/${entry.url}`})),
        }),
      ],
      additionalManifestEntries: [{url: '/extra.txt', revision: '42'}],
    });

    await expect(readSwManifest(outDir.path)).resolves.toEqual([
      {url: '/static/main.js', revision: null},
      {url: '/extra.txt', revision: '42'},
    ]);
  });
});
