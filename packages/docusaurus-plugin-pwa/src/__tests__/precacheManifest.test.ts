/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {afterEach, describe, expect, it, vi} from 'vitest';
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

// Like FIPS mode, where OpenSSL doesn't provide MD5
function disableMd5() {
  const unsupported = (algorithm: string) => {
    if (algorithm === 'md5') {
      throw new Error('error:0308010C:digital envelope routines::unsupported');
    }
  };

  // Workbox is a CommonJS dependency calling crypto.createHash()
  const createHash = crypto.createHash;
  vi.spyOn(crypto, 'createHash').mockImplementation((algorithm, ...args) => {
    unsupported(algorithm);
    return createHash(algorithm, ...args);
  });

  // Docusaurus checks once on load if crypto.hash() supports MD5
  vi.doMock('node:crypto', async (importOriginal) => {
    const originalCrypto = await importOriginal<typeof import('node:crypto')>();
    return {
      ...originalCrypto,
      hash: (algorithm: string, data: string) => {
        unsupported(algorithm);
        return originalCrypto.hash(algorithm, data);
      },
    };
  });
  vi.resetModules();
}

describe('injectPrecacheManifest', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.doUnmock('node:crypto');
    vi.resetModules();
  });

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

  it('hashes with SHA-256 when MD5 is not available', async () => {
    disableMd5();
    const fipsModule = await import('../precacheManifest');
    await using outDir = await createOutDir();

    await fipsModule.injectPrecacheManifest(getOptions(outDir.path));

    await expect(readSwManifest(outDir.path)).resolves.toEqual([
      {
        url: 'assets/main.css',
        revision:
          '7c98040a541657584690ae2a1cc3b42a8b53b159cc60c5d3abbfecbaeac6c94a',
      },
      {
        url: 'assets/main.js',
        revision:
          '6e11c72f7cf6bc383152dd16ddd5903aba6bb1c99d6b6639a4bb0b838185fa92',
      },
      {
        url: 'index.html',
        revision:
          '1a7133067a4ac7fe06565943dd44870f232041b1d28b4340e2b678244a3b79f6',
      },
    ]);
  });

  it('works around Workbox precaching nothing when MD5 is not available', async () => {
    disableMd5();
    await using outDir = await createOutDir();

    const result = await injectManifest(getOptions(outDir.path));

    expect(result.warnings).toEqual([
      "An error occurred when attempting to create a file hash. 'error:0308010C:digital envelope routines::unsupported'",
    ]);
    await expect(readSwManifest(outDir.path)).resolves.toEqual([]);
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
