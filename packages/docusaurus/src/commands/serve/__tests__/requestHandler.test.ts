/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import http from 'node:http';
import {listenToServer} from '../listenToServer';
import {createServeRequestHandler} from '../requestHandler';
import {CrashHeader, describeRequest, fixtureOutDir} from './testUtils';
import type {AddressInfo} from 'node:net';
import type {DocusaurusConfig} from '@docusaurus/types';

type ServeOptions = Pick<DocusaurusConfig, 'baseUrl' | 'trailingSlash'>;

// Appended to the baseUrl. The fixture build extends the static deployment of
// https://github.com/slorber/trailing-slash-guide
const RequestPaths = [
  '/',
  '/index',
  '/index.html',

  '/file',
  '/file/',
  '/file.html',

  '/folder',
  '/folder/',
  '/folder/index',
  '/folder/index.html',

  '/both',
  '/both/',
  '/both.html',
  '/both/index.html',

  '/assets/css/styles.css',
  '/assets/css/styles.css?v=1',
  '/assets/',
  '/site.webmanifest',

  '/missing',
  '/missing/',
  '/missing.html',

  '/file?query=1',
  '/file/?query=1',
  '/file.html?query=1',
  '/folder?query=1',

  '/with%20space',
  '/with%20space.html',
  '/файл',
  '/файл.html',
  '/café',

  '//file',
  '/%E0%A4%A', // Malformed percent-encoding
  // cspell:ignore Fdocusaurus
  '/..%2Fdocusaurus.config.js', // Path traversal
];

describe('createServeRequestHandler', () => {
  describe('baseUrl /', () => {
    it('trailingSlash undefined', async () => {
      const result = await describeServing({
        baseUrl: '/',
        trailingSlash: undefined,
      });
      expect(result).toMatchInlineSnapshot(`
        "/                           200 index.html
        /index                      301 / → 200 index.html
        /index.html                 301 /index → 301 / → 200 index.html
        /file                       200 file.html
        /file/                      200 file.html
        /file.html                  301 /file → 200 file.html
        /folder                     200 folder/index.html
        /folder/                    200 folder/index.html
        /folder/index               301 /folder → 200 folder/index.html
        /folder/index.html          301 /folder/index → 301 /folder → 200 folder/index.html
        /both                       200 both/index.html
        /both/                      200 both/index.html
        /both.html                  301 /both → 200 both/index.html
        /both/index.html            301 /both/index → 301 /both → 200 both/index.html
        /assets/css/styles.css      200 assets/css/styles.css
        /assets/css/styles.css?v=1  200 assets/css/styles.css
        /assets/                    404 404.html
        /site.webmanifest           200 site.webmanifest
        /missing                    404 404.html
        /missing/                   404 404.html
        /missing.html               301 /missing → 404 404.html
        /file?query=1               200 file.html
        /file/?query=1              200 file.html
        /file.html?query=1          301 /file → 200 file.html
        /folder?query=1             200 folder/index.html
        /with%20space               200 with space.html
        /with%20space.html          301 /with%20space → 200 with space.html
        /файл                       200 файл.html
        /файл.html                  301 /%D1%84%D0%B0%D0%B9%D0%BB → 200 файл.html
        /café                       crash ERR_INVALID_CHAR
        //file                      200 file.html
        /%E0%A4%A                   400 Bad Request
        /..%2Fdocusaurus.config.js  400 Bad Request"
      `);
    });

    it('trailingSlash true', async () => {
      const result = await describeServing({
        baseUrl: '/',
        trailingSlash: true,
      });
      expect(result).toMatchInlineSnapshot(`
        "/                           200 index.html
        /index                      301 / → 200 index.html
        /index.html                 301 /index → 301 / → 200 index.html
        /file                       301 /file/ → 200 file.html
        /file/                      200 file.html
        /file.html                  301 /file → 301 /file/ → 200 file.html
        /folder                     301 /folder/ → 200 folder/index.html
        /folder/                    200 folder/index.html
        /folder/index               301 /folder → 301 /folder/ → 200 folder/index.html
        /folder/index.html          301 /folder/index → 301 /folder → 301 /folder/ → 200 folder/index.html
        /both                       301 /both/ → 200 both/index.html
        /both/                      200 both/index.html
        /both.html                  301 /both → 301 /both/ → 200 both/index.html
        /both/index.html            301 /both/index → 301 /both → 301 /both/ → 200 both/index.html
        /assets/css/styles.css      200 assets/css/styles.css
        /assets/css/styles.css?v=1  200 assets/css/styles.css
        /assets/                    404 404.html
        /site.webmanifest           200 site.webmanifest
        /missing                    301 /missing/ → 404 404.html
        /missing/                   404 404.html
        /missing.html               301 /missing → 301 /missing/ → 404 404.html
        /file?query=1               301 /file/ → 200 file.html
        /file/?query=1              200 file.html
        /file.html?query=1          301 /file → 301 /file/ → 200 file.html
        /folder?query=1             301 /folder/ → 200 folder/index.html
        /with%20space               301 /with%20space/ → 200 with space.html
        /with%20space.html          301 /with%20space → 301 /with%20space/ → 200 with space.html
        /файл                       301 /%D1%84%D0%B0%D0%B9%D0%BB/ → 200 файл.html
        /файл.html                  301 /%D1%84%D0%B0%D0%B9%D0%BB → 301 /%D1%84%D0%B0%D0%B9%D0%BB/ → 200 файл.html
        /café                       301 /caf%C3%A9/ → crash ERR_INVALID_CHAR
        //file                      301 /file → 301 /file/ → 200 file.html
        /%E0%A4%A                   400 Bad Request
        /..%2Fdocusaurus.config.js  400 Bad Request"
      `);
    });

    it('trailingSlash false', async () => {
      const result = await describeServing({
        baseUrl: '/',
        trailingSlash: false,
      });
      expect(result).toMatchInlineSnapshot(`
        "/                           200 index.html
        /index                      301 / → 200 index.html
        /index.html                 301 /index → 301 / → 200 index.html
        /file                       200 file.html
        /file/                      301 /file → 200 file.html
        /file.html                  301 /file → 200 file.html
        /folder                     200 folder/index.html
        /folder/                    301 /folder → 200 folder/index.html
        /folder/index               301 /folder → 200 folder/index.html
        /folder/index.html          301 /folder/index → 301 /folder → 200 folder/index.html
        /both                       200 both/index.html
        /both/                      301 /both → 200 both/index.html
        /both.html                  301 /both → 200 both/index.html
        /both/index.html            301 /both/index → 301 /both → 200 both/index.html
        /assets/css/styles.css      200 assets/css/styles.css
        /assets/css/styles.css?v=1  200 assets/css/styles.css
        /assets/                    301 /assets → 404 404.html
        /site.webmanifest           200 site.webmanifest
        /missing                    404 404.html
        /missing/                   301 /missing → 404 404.html
        /missing.html               301 /missing → 404 404.html
        /file?query=1               200 file.html
        /file/?query=1              301 /file → 200 file.html
        /file.html?query=1          301 /file → 200 file.html
        /folder?query=1             200 folder/index.html
        /with%20space               200 with space.html
        /with%20space.html          301 /with%20space → 200 with space.html
        /файл                       200 файл.html
        /файл.html                  301 /%D1%84%D0%B0%D0%B9%D0%BB → 200 файл.html
        /café                       crash ERR_INVALID_CHAR
        //file                      301 /file → 200 file.html
        /%E0%A4%A                   400 Bad Request
        /..%2Fdocusaurus.config.js  400 Bad Request"
      `);
    });
  });

  describe('baseUrl /base/', () => {
    it('trailingSlash undefined', async () => {
      const result = await describeServing({
        baseUrl: '/base/',
        trailingSlash: undefined,
      });
      expect(result).toMatchInlineSnapshot(`
        "/base/                           200 index.html
        /base/index                      301 / → 302 /base/ → 200 index.html
        /base/index.html                 301 /index → 302 /base/ → 200 index.html
        /base/file                       200 file.html
        /base/file/                      200 file.html
        /base/file.html                  301 /file → 302 /base/ → 200 index.html
        /base/folder                     200 folder/index.html
        /base/folder/                    200 folder/index.html
        /base/folder/index               301 /folder → 302 /base/ → 200 index.html
        /base/folder/index.html          301 /folder/index → 302 /base/ → 200 index.html
        /base/both                       200 both/index.html
        /base/both/                      200 both/index.html
        /base/both.html                  301 /both → 302 /base/ → 200 index.html
        /base/both/index.html            301 /both/index → 302 /base/ → 200 index.html
        /base/assets/css/styles.css      200 assets/css/styles.css
        /base/assets/css/styles.css?v=1  200 assets/css/styles.css
        /base/assets/                    404 404.html
        /base/site.webmanifest           200 site.webmanifest
        /base/missing                    404 404.html
        /base/missing/                   404 404.html
        /base/missing.html               301 /missing → 302 /base/ → 200 index.html
        /base/file?query=1               200 file.html
        /base/file/?query=1              200 file.html
        /base/file.html?query=1          301 /file → 302 /base/ → 200 index.html
        /base/folder?query=1             200 folder/index.html
        /base/with%20space               200 with space.html
        /base/with%20space.html          301 /with%20space → 302 /base/ → 200 index.html
        /base/файл                       200 файл.html
        /base/файл.html                  301 /%D1%84%D0%B0%D0%B9%D0%BB → 302 /base/ → 200 index.html
        /base/café                       crash ERR_INVALID_CHAR
        /base//file                      200 file.html
        /base/%E0%A4%A                   400 Bad Request
        /base/..%2Fdocusaurus.config.js  400 Bad Request"
      `);
    });

    // Windows serves file paths with a trailing slash, other platforms 404
    it.skipIf(process.platform === 'win32')('trailingSlash true', async () => {
      const result = await describeServing({
        baseUrl: '/base/',
        trailingSlash: true,
      });
      expect(result).toMatchInlineSnapshot(`
        "/base/                           200 index.html
        /base/index                      302 /base/index/ → 200 index.html
        /base/index.html                 301 /index → 302 /base/ → 200 index.html
        /base/file                       302 /base/file/ → 200 file.html
        /base/file/                      200 file.html
        /base/file.html                  301 /file → 302 /base/ → 200 index.html
        /base/folder                     302 /base/folder/ → 200 folder/index.html
        /base/folder/                    200 folder/index.html
        /base/folder/index               302 /base/folder/index/ → 200 folder/index.html
        /base/folder/index.html          301 /folder/index → 302 /base/ → 200 index.html
        /base/both                       302 /base/both/ → 200 both/index.html
        /base/both/                      200 both/index.html
        /base/both.html                  301 /both → 302 /base/ → 200 index.html
        /base/both/index.html            301 /both/index → 302 /base/ → 200 index.html
        /base/assets/css/styles.css      200 assets/css/styles.css
        /base/assets/css/styles.css?v=1  302 /base/assets/css/styles.css/?v=1 → 404 404.html
        /base/assets/                    404 404.html
        /base/site.webmanifest           302 /base/site.webmanifest/ → 404 404.html
        /base/missing                    302 /base/missing/ → 404 404.html
        /base/missing/                   404 404.html
        /base/missing.html               301 /missing → 302 /base/ → 200 index.html
        /base/file?query=1               302 /base/file/?query=1 → 200 file.html
        /base/file/?query=1              200 file.html
        /base/file.html?query=1          302 /base/file.html/?query=1 → 404 404.html
        /base/folder?query=1             302 /base/folder/?query=1 → 200 folder/index.html
        /base/with%20space               302 /base/with%20space/ → 200 with space.html
        /base/with%20space.html          301 /with%20space → 302 /base/ → 200 index.html
        /base/файл                       302 /base/%D1%84%D0%B0%D0%B9%D0%BB/ → 200 файл.html
        /base/файл.html                  301 /%D1%84%D0%B0%D0%B9%D0%BB → 302 /base/ → 200 index.html
        /base/café                       302 /base/caf%C3%A9/ → crash ERR_INVALID_CHAR
        /base//file                      302 /base//file/ → 301 /file/ → 302 /base/ → 200 index.html
        /base/%E0%A4%A                   302 /base/%E0%A4%A/ → 400 Bad Request
        /base/..%2Fdocusaurus.config.js  400 Bad Request"
      `);
    });

    it('trailingSlash false', async () => {
      const result = await describeServing({
        baseUrl: '/base/',
        trailingSlash: false,
      });
      expect(result).toMatchInlineSnapshot(`
        "/base/                           200 index.html
        /base/index                      301 / → 302 /base/ → 200 index.html
        /base/index.html                 301 /index → 302 /base/ → 200 index.html
        /base/file                       200 file.html
        /base/file/                      302 /base/file → 200 file.html
        /base/file.html                  301 /file → 302 /base/ → 200 index.html
        /base/folder                     200 folder/index.html
        /base/folder/                    302 /base/folder → 200 folder/index.html
        /base/folder/index               301 /folder → 302 /base/ → 200 index.html
        /base/folder/index.html          301 /folder/index → 302 /base/ → 200 index.html
        /base/both                       200 both/index.html
        /base/both/                      302 /base/both → 200 both/index.html
        /base/both.html                  301 /both → 302 /base/ → 200 index.html
        /base/both/index.html            301 /both/index → 302 /base/ → 200 index.html
        /base/assets/css/styles.css      200 assets/css/styles.css
        /base/assets/css/styles.css?v=1  200 assets/css/styles.css
        /base/assets/                    302 /base/assets → 404 404.html
        /base/site.webmanifest           200 site.webmanifest
        /base/missing                    404 404.html
        /base/missing/                   302 /base/missing → 404 404.html
        /base/missing.html               301 /missing → 302 /base/ → 200 index.html
        /base/file?query=1               200 file.html
        /base/file/?query=1              302 /base/file?query=1 → 200 file.html
        /base/file.html?query=1          301 /file → 302 /base/ → 200 index.html
        /base/folder?query=1             200 folder/index.html
        /base/with%20space               200 with space.html
        /base/with%20space.html          301 /with%20space → 302 /base/ → 200 index.html
        /base/файл                       200 файл.html
        /base/файл.html                  301 /%D1%84%D0%B0%D0%B9%D0%BB → 302 /base/ → 200 index.html
        /base/café                       crash ERR_INVALID_CHAR
        /base//file                      301 /file → 302 /base/ → 200 index.html
        /base/%E0%A4%A                   400 Bad Request
        /base/..%2Fdocusaurus.config.js  400 Bad Request"
      `);
    });

    it('redirects requests outside the baseUrl', async () => {
      const result = await describeRequests(
        {baseUrl: '/base/', trailingSlash: undefined},
        ['/', '/file', '/base', '/base?query=1', '/basement'],
      );
      expect(result).toMatchInlineSnapshot(`
        "/              302 /base/ → 200 index.html
        /file          302 /base/ → 200 index.html
        /base          302 /base/ → 200 index.html
        /base?query=1  302 /base/ → 200 index.html
        /basement      302 /base/ → 200 index.html"
      `);
    });
  });

  // Also captured by the snapshots above. it.fails() passes while the bug is
  // there: fixing one turns its test red, replace it.fails() with it()
  describe('known bugs', () => {
    // See https://github.com/vercel/serve-handler/issues/205
    it.fails('serves file names with Latin-1 characters', async () => {
      await expect(
        serveRequest({baseUrl: '/', trailingSlash: undefined}, '/café'),
      ).resolves.toBe('200 café.html');
    });

    // See https://github.com/meta/docusaurus/issues/10078#issuecomment-2084932934
    it.fails('keeps the baseUrl in serve-handler redirects', async () => {
      await expect(
        serveRequest(
          {baseUrl: '/base/', trailingSlash: undefined},
          '/base/file.html',
        ),
      ).resolves.toBe('301 /base/file → 200 file.html');
    });

    // The looksLikeAsset regex misses them, and adds a trailing slash
    // See https://github.com/meta/docusaurus/pull/10090
    it.fails('serves assets with a query string under a baseUrl', async () => {
      await expect(
        serveRequest(
          {baseUrl: '/base/', trailingSlash: true},
          '/base/assets/css/styles.css?v=1',
        ),
      ).resolves.toBe('200 assets/css/styles.css');
    });

    it.fails('serves assets with a long extension under a baseUrl', async () => {
      await expect(
        serveRequest(
          {baseUrl: '/base/', trailingSlash: true},
          '/base/site.webmanifest',
        ),
      ).resolves.toBe('200 site.webmanifest');
    });
  });
});

async function describeServing(options: ServeOptions): Promise<string> {
  const baseUrlPrefix = options.baseUrl.replace(/\/$/, '');
  const paths = RequestPaths.map((requestPath) => baseUrlPrefix + requestPath);
  return describeRequests(options, paths);
}

// One line per request, aligned to be easy to review in snapshots
async function describeRequests(
  options: ServeOptions,
  paths: string[],
): Promise<string> {
  const descriptions = await withServer(options, (origin) =>
    Promise.all(paths.map((path) => describeRequest(origin, path))),
  );
  const pathWidth = Math.max(...paths.map((path) => path.length));
  return paths
    .map((path, index) => `${path.padEnd(pathWidth)}  ${descriptions[index]}`)
    .join('\n');
}

async function serveRequest(
  options: ServeOptions,
  path: string,
): Promise<string> {
  return withServer(options, (origin) => describeRequest(origin, path));
}

async function withServer<T>(
  options: ServeOptions,
  callback: (origin: string) => Promise<T>,
): Promise<T> {
  const handleRequest = createServeRequestHandler({
    outDir: fixtureOutDir,
    ...options,
  });
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch((error: NodeJS.ErrnoException) =>
      respondWithCrash(res, error),
    );
  });

  await listenToServer({server, host: '127.0.0.1', port: 0});
  try {
    const {port} = server.address() as AddressInfo;
    return await callback(`http://127.0.0.1:${port}`);
  } finally {
    server.closeAllConnections();
    server.close();
  }
}

// In production, this rejection is unhandled and crashes the server process
function respondWithCrash(
  res: http.ServerResponse,
  error: NodeJS.ErrnoException,
) {
  if (res.headersSent) {
    res.destroy();
    return;
  }
  // A failed writeHead() can leave the Content-Length of the file to serve
  res.writeHead(500, {
    [CrashHeader]: error.code ?? 'unknown',
    'Content-Length': 0,
  });
  res.end();
}
