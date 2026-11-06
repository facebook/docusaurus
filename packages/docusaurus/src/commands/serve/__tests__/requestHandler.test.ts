/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {describeRequests, describeServing, serveRequest} from './testUtils';

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

  // Folders with a dot, like a docs version or a package name
  '/docs/2.x',
  '/docs/2.x/',
  '/docs/lodash.debounce',
  '/docs/lodash.debounce/',

  '/assets/css/styles.css',
  '/assets/css/styles.css?v=1',
  '/assets/',
  // Extensions of 1, 3, 4, 5 and 11 characters
  '/assets/files/main.c',
  '/assets/files/document.pdf',
  '/assets/images/photo.jpeg',
  '/assets/fonts/font.woff2',
  '/site.webmanifest',

  '/missing',
  '/missing/',
  '/missing.html',

  '/file?query=1',
  '/file/?query=1',
  '/file.html?query=1',
  '/folder?query=1',
  '/folder?v=1.0', // Looks like an extension

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

// Appended to the baseUrl. Browsers normalize these URLs before sending them,
// but hand-typed requests can send them as-is
// Not strictly needed for a local preview server, but useful if we ever expose
// the serve request handler as a Node API
const HandTypedRequestPaths = [
  '/file.html#hash',
  '/file.html?query=1#hash',
  '/file#hash.html',
  '/folder/index#hash',
  '/assets/css/styles.css#hash',
  '/./file.html',
  '/folder/../file.html',
  '/../file.html',
  '/%2E%2E/file.html',
  // Open redirect attempts
  '/..//example.com/index',
  '/..//example.com/file',
];

describe('createServeRequestHandler', () => {
  describe('baseUrl /', () => {
    it('trailingSlash undefined', async () => {
      const result = await describeServing(
        {baseUrl: '/', trailingSlash: undefined},
        RequestPaths,
      );
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
        /docs/2.x                   404 404.html
        /docs/2.x/                  404 404.html
        /docs/lodash.debounce       404 404.html
        /docs/lodash.debounce/      404 404.html
        /assets/css/styles.css      200 assets/css/styles.css
        /assets/css/styles.css?v=1  200 assets/css/styles.css
        /assets/                    404 404.html
        /assets/files/main.c        200 assets/files/main.c
        /assets/files/document.pdf  200 assets/files/document.pdf
        /assets/images/photo.jpeg   200 assets/images/photo.jpeg
        /assets/fonts/font.woff2    200 assets/fonts/font.woff2
        /site.webmanifest           200 site.webmanifest
        /missing                    404 404.html
        /missing/                   404 404.html
        /missing.html               301 /missing → 404 404.html
        /file?query=1               200 file.html
        /file/?query=1              200 file.html
        /file.html?query=1          301 /file → 200 file.html
        /folder?query=1             200 folder/index.html
        /folder?v=1.0               200 folder/index.html
        /with%20space               200 with space.html
        /with%20space.html          301 /with%20space → 200 with space.html
        /файл                       200 файл.html
        /файл.html                  301 /%D1%84%D0%B0%D0%B9%D0%BB → 200 файл.html
        /café                       200 café.html
        //file                      200 file.html
        /%E0%A4%A                   400 Bad Request
        /..%2Fdocusaurus.config.js  400 Bad Request"
      `);
    });

    it('trailingSlash true', async () => {
      const result = await describeServing(
        {baseUrl: '/', trailingSlash: true},
        RequestPaths,
      );
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
        /docs/2.x                   404 404.html
        /docs/2.x/                  404 404.html
        /docs/lodash.debounce       404 404.html
        /docs/lodash.debounce/      404 404.html
        /assets/css/styles.css      200 assets/css/styles.css
        /assets/css/styles.css?v=1  200 assets/css/styles.css
        /assets/                    404 404.html
        /assets/files/main.c        200 assets/files/main.c
        /assets/files/document.pdf  200 assets/files/document.pdf
        /assets/images/photo.jpeg   200 assets/images/photo.jpeg
        /assets/fonts/font.woff2    200 assets/fonts/font.woff2
        /site.webmanifest           200 site.webmanifest
        /missing                    301 /missing/ → 404 404.html
        /missing/                   404 404.html
        /missing.html               301 /missing → 301 /missing/ → 404 404.html
        /file?query=1               301 /file/ → 200 file.html
        /file/?query=1              200 file.html
        /file.html?query=1          301 /file → 301 /file/ → 200 file.html
        /folder?query=1             301 /folder/ → 200 folder/index.html
        /folder?v=1.0               301 /folder/ → 200 folder/index.html
        /with%20space               301 /with%20space/ → 200 with space.html
        /with%20space.html          301 /with%20space → 301 /with%20space/ → 200 with space.html
        /файл                       301 /%D1%84%D0%B0%D0%B9%D0%BB/ → 200 файл.html
        /файл.html                  301 /%D1%84%D0%B0%D0%B9%D0%BB → 301 /%D1%84%D0%B0%D0%B9%D0%BB/ → 200 файл.html
        /café                       301 /caf%C3%A9/ → 200 café.html
        //file                      301 /file → 301 /file/ → 200 file.html
        /%E0%A4%A                   400 Bad Request
        /..%2Fdocusaurus.config.js  400 Bad Request"
      `);
    });

    it('trailingSlash false', async () => {
      const result = await describeServing(
        {baseUrl: '/', trailingSlash: false},
        RequestPaths,
      );
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
        /docs/2.x                   404 404.html
        /docs/2.x/                  301 /docs/2.x → 404 404.html
        /docs/lodash.debounce       404 404.html
        /docs/lodash.debounce/      301 /docs/lodash.debounce → 404 404.html
        /assets/css/styles.css      200 assets/css/styles.css
        /assets/css/styles.css?v=1  200 assets/css/styles.css
        /assets/                    301 /assets → 404 404.html
        /assets/files/main.c        200 assets/files/main.c
        /assets/files/document.pdf  200 assets/files/document.pdf
        /assets/images/photo.jpeg   200 assets/images/photo.jpeg
        /assets/fonts/font.woff2    200 assets/fonts/font.woff2
        /site.webmanifest           200 site.webmanifest
        /missing                    404 404.html
        /missing/                   301 /missing → 404 404.html
        /missing.html               301 /missing → 404 404.html
        /file?query=1               200 file.html
        /file/?query=1              301 /file → 200 file.html
        /file.html?query=1          301 /file → 200 file.html
        /folder?query=1             200 folder/index.html
        /folder?v=1.0               200 folder/index.html
        /with%20space               200 with space.html
        /with%20space.html          301 /with%20space → 200 with space.html
        /файл                       200 файл.html
        /файл.html                  301 /%D1%84%D0%B0%D0%B9%D0%BB → 200 файл.html
        /café                       200 café.html
        //file                      301 /file → 200 file.html
        /%E0%A4%A                   400 Bad Request
        /..%2Fdocusaurus.config.js  400 Bad Request"
      `);
    });
  });

  describe('baseUrl /base/', () => {
    it('trailingSlash undefined', async () => {
      const result = await describeServing(
        {baseUrl: '/base/', trailingSlash: undefined},
        RequestPaths,
      );
      expect(result).toMatchInlineSnapshot(`
        "/base/                           200 index.html
        /base/index                      302 /base/ → 200 index.html
        /base/index.html                 302 /base/index → 302 /base/ → 200 index.html
        /base/file                       200 file.html
        /base/file/                      200 file.html
        /base/file.html                  302 /base/file → 200 file.html
        /base/folder                     200 folder/index.html
        /base/folder/                    200 folder/index.html
        /base/folder/index               302 /base/folder → 200 folder/index.html
        /base/folder/index.html          302 /base/folder/index → 302 /base/folder → 200 folder/index.html
        /base/both                       200 both/index.html
        /base/both/                      200 both/index.html
        /base/both.html                  302 /base/both → 200 both/index.html
        /base/both/index.html            302 /base/both/index → 302 /base/both → 200 both/index.html
        /base/docs/2.x                   404 404.html
        /base/docs/2.x/                  404 404.html
        /base/docs/lodash.debounce       404 404.html
        /base/docs/lodash.debounce/      404 404.html
        /base/assets/css/styles.css      200 assets/css/styles.css
        /base/assets/css/styles.css?v=1  200 assets/css/styles.css
        /base/assets/                    404 404.html
        /base/assets/files/main.c        200 assets/files/main.c
        /base/assets/files/document.pdf  200 assets/files/document.pdf
        /base/assets/images/photo.jpeg   200 assets/images/photo.jpeg
        /base/assets/fonts/font.woff2    200 assets/fonts/font.woff2
        /base/site.webmanifest           200 site.webmanifest
        /base/missing                    404 404.html
        /base/missing/                   404 404.html
        /base/missing.html               302 /base/missing → 404 404.html
        /base/file?query=1               200 file.html
        /base/file/?query=1              200 file.html
        /base/file.html?query=1          302 /base/file?query=1 → 200 file.html
        /base/folder?query=1             200 folder/index.html
        /base/folder?v=1.0               200 folder/index.html
        /base/with%20space               200 with space.html
        /base/with%20space.html          302 /base/with%20space → 200 with space.html
        /base/файл                       200 файл.html
        /base/файл.html                  302 /base/%D1%84%D0%B0%D0%B9%D0%BB → 200 файл.html
        /base/café                       200 café.html
        /base//file                      302 /base/file → 200 file.html
        /base/%E0%A4%A                   400 Bad Request
        /base/..%2Fdocusaurus.config.js  400 Bad Request"
      `);
    });

    it('trailingSlash true', async () => {
      const result = await describeServing(
        {baseUrl: '/base/', trailingSlash: true},
        RequestPaths,
      );
      expect(result).toMatchInlineSnapshot(`
        "/base/                           200 index.html
        /base/index                      302 /base/ → 200 index.html
        /base/index.html                 302 /base/index → 302 /base/ → 200 index.html
        /base/file                       302 /base/file/ → 200 file.html
        /base/file/                      200 file.html
        /base/file.html                  302 /base/file → 302 /base/file/ → 200 file.html
        /base/folder                     302 /base/folder/ → 200 folder/index.html
        /base/folder/                    200 folder/index.html
        /base/folder/index               302 /base/folder → 302 /base/folder/ → 200 folder/index.html
        /base/folder/index.html          302 /base/folder/index → 302 /base/folder → 302 /base/folder/ → 200 folder/index.html
        /base/both                       302 /base/both/ → 200 both/index.html
        /base/both/                      200 both/index.html
        /base/both.html                  302 /base/both → 302 /base/both/ → 200 both/index.html
        /base/both/index.html            302 /base/both/index → 302 /base/both → 302 /base/both/ → 200 both/index.html
        /base/docs/2.x                   404 404.html
        /base/docs/2.x/                  404 404.html
        /base/docs/lodash.debounce       404 404.html
        /base/docs/lodash.debounce/      404 404.html
        /base/assets/css/styles.css      200 assets/css/styles.css
        /base/assets/css/styles.css?v=1  200 assets/css/styles.css
        /base/assets/                    404 404.html
        /base/assets/files/main.c        200 assets/files/main.c
        /base/assets/files/document.pdf  200 assets/files/document.pdf
        /base/assets/images/photo.jpeg   200 assets/images/photo.jpeg
        /base/assets/fonts/font.woff2    200 assets/fonts/font.woff2
        /base/site.webmanifest           200 site.webmanifest
        /base/missing                    302 /base/missing/ → 404 404.html
        /base/missing/                   404 404.html
        /base/missing.html               302 /base/missing → 302 /base/missing/ → 404 404.html
        /base/file?query=1               302 /base/file/?query=1 → 200 file.html
        /base/file/?query=1              200 file.html
        /base/file.html?query=1          302 /base/file?query=1 → 302 /base/file/?query=1 → 200 file.html
        /base/folder?query=1             302 /base/folder/?query=1 → 200 folder/index.html
        /base/folder?v=1.0               302 /base/folder/?v=1.0 → 200 folder/index.html
        /base/with%20space               302 /base/with%20space/ → 200 with space.html
        /base/with%20space.html          302 /base/with%20space → 302 /base/with%20space/ → 200 with space.html
        /base/файл                       302 /base/%D1%84%D0%B0%D0%B9%D0%BB/ → 200 файл.html
        /base/файл.html                  302 /base/%D1%84%D0%B0%D0%B9%D0%BB → 302 /base/%D1%84%D0%B0%D0%B9%D0%BB/ → 200 файл.html
        /base/café                       302 /base/caf%C3%A9/ → 200 café.html
        /base//file                      302 /base/file → 302 /base/file/ → 200 file.html
        /base/%E0%A4%A                   302 /base/%E0%A4%A/ → 400 Bad Request
        /base/..%2Fdocusaurus.config.js  400 Bad Request"
      `);
    });

    it('trailingSlash false', async () => {
      const result = await describeServing(
        {baseUrl: '/base/', trailingSlash: false},
        RequestPaths,
      );
      expect(result).toMatchInlineSnapshot(`
        "/base/                           200 index.html
        /base/index                      302 /base/ → 200 index.html
        /base/index.html                 302 /base/index → 302 /base/ → 200 index.html
        /base/file                       200 file.html
        /base/file/                      302 /base/file → 200 file.html
        /base/file.html                  302 /base/file → 200 file.html
        /base/folder                     200 folder/index.html
        /base/folder/                    302 /base/folder → 200 folder/index.html
        /base/folder/index               302 /base/folder → 200 folder/index.html
        /base/folder/index.html          302 /base/folder/index → 302 /base/folder → 200 folder/index.html
        /base/both                       200 both/index.html
        /base/both/                      302 /base/both → 200 both/index.html
        /base/both.html                  302 /base/both → 200 both/index.html
        /base/both/index.html            302 /base/both/index → 302 /base/both → 200 both/index.html
        /base/docs/2.x                   404 404.html
        /base/docs/2.x/                  302 /base/docs/2.x → 404 404.html
        /base/docs/lodash.debounce       404 404.html
        /base/docs/lodash.debounce/      302 /base/docs/lodash.debounce → 404 404.html
        /base/assets/css/styles.css      200 assets/css/styles.css
        /base/assets/css/styles.css?v=1  200 assets/css/styles.css
        /base/assets/                    302 /base/assets → 404 404.html
        /base/assets/files/main.c        200 assets/files/main.c
        /base/assets/files/document.pdf  200 assets/files/document.pdf
        /base/assets/images/photo.jpeg   200 assets/images/photo.jpeg
        /base/assets/fonts/font.woff2    200 assets/fonts/font.woff2
        /base/site.webmanifest           200 site.webmanifest
        /base/missing                    404 404.html
        /base/missing/                   302 /base/missing → 404 404.html
        /base/missing.html               302 /base/missing → 404 404.html
        /base/file?query=1               200 file.html
        /base/file/?query=1              302 /base/file?query=1 → 200 file.html
        /base/file.html?query=1          302 /base/file?query=1 → 200 file.html
        /base/folder?query=1             200 folder/index.html
        /base/folder?v=1.0               200 folder/index.html
        /base/with%20space               200 with space.html
        /base/with%20space.html          302 /base/with%20space → 200 with space.html
        /base/файл                       200 файл.html
        /base/файл.html                  302 /base/%D1%84%D0%B0%D0%B9%D0%BB → 200 файл.html
        /base/café                       200 café.html
        /base//file                      302 /base/file → 200 file.html
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

    describe('hand-typed URLs', () => {
      it('trailingSlash undefined', async () => {
        const result = await describeServing(
          {baseUrl: '/base/', trailingSlash: undefined},
          HandTypedRequestPaths,
          {asIs: true},
        );
        expect(result).toMatchInlineSnapshot(`
          "/base/file.html#hash              302 /base/file → 200 file.html
          /base/file.html?query=1#hash      302 /base/file?query=1 → 200 file.html
          /base/file#hash.html              200 file.html
          /base/folder/index#hash           302 /base/folder → 200 folder/index.html
          /base/assets/css/styles.css#hash  200 assets/css/styles.css
          /base/./file.html                 302 /base/file → 200 file.html
          /base/folder/../file.html         302 /base/file → 200 file.html
          /base/../file.html                400 Bad Request
          /base/%2E%2E/file.html            400 Bad Request
          /base/..//example.com/index       400 Bad Request
          /base/..//example.com/file        400 Bad Request"
        `);
      });

      it('trailingSlash true', async () => {
        const result = await describeServing(
          {baseUrl: '/base/', trailingSlash: true},
          HandTypedRequestPaths,
          {asIs: true},
        );
        expect(result).toMatchInlineSnapshot(`
          "/base/file.html#hash              302 /base/file → 302 /base/file/ → 200 file.html
          /base/file.html?query=1#hash      302 /base/file?query=1 → 302 /base/file/?query=1 → 200 file.html
          /base/file#hash.html              302 /base/file/ → 200 file.html
          /base/folder/index#hash           302 /base/folder → 302 /base/folder/ → 200 folder/index.html
          /base/assets/css/styles.css#hash  200 assets/css/styles.css
          /base/./file.html                 302 /base/file → 302 /base/file/ → 200 file.html
          /base/folder/../file.html         302 /base/file → 302 /base/file/ → 200 file.html
          /base/../file.html                400 Bad Request
          /base/%2E%2E/file.html            400 Bad Request
          /base/..//example.com/index       400 Bad Request
          /base/..//example.com/file        400 Bad Request"
        `);
      });

      it('trailingSlash false', async () => {
        const result = await describeServing(
          {baseUrl: '/base/', trailingSlash: false},
          HandTypedRequestPaths,
          {asIs: true},
        );
        expect(result).toMatchInlineSnapshot(`
          "/base/file.html#hash              302 /base/file → 200 file.html
          /base/file.html?query=1#hash      302 /base/file?query=1 → 200 file.html
          /base/file#hash.html              200 file.html
          /base/folder/index#hash           302 /base/folder → 200 folder/index.html
          /base/assets/css/styles.css#hash  200 assets/css/styles.css
          /base/./file.html                 302 /base/file → 200 file.html
          /base/folder/../file.html         302 /base/file → 200 file.html
          /base/../file.html                400 Bad Request
          /base/%2E%2E/file.html            400 Bad Request
          /base/..//example.com/index       400 Bad Request
          /base/..//example.com/file        400 Bad Request"
        `);
      });
    });
  });

  // These tests capture edge cases, also visible in the snapshots above
  describe('edge cases', () => {
    // See https://github.com/vercel/serve-handler/issues/205
    it('serves file names with Latin-1 characters', async () => {
      await expect(
        serveRequest({baseUrl: '/', trailingSlash: undefined}, '/café'),
      ).resolves.toBe('200 café.html');
    });

    // See https://github.com/meta/docusaurus/issues/10078#issuecomment-2084932934
    it('keeps the baseUrl in clean URL redirects', async () => {
      await expect(
        serveRequest(
          {baseUrl: '/base/', trailingSlash: undefined},
          '/base/file.html',
        ),
      ).resolves.toBe('302 /base/file → 200 file.html');
    });

    it('redirects clean URLs containing $ characters', async () => {
      await expect(
        serveRequest(
          {baseUrl: '/base/', trailingSlash: undefined},
          '/base/a$&b.html',
        ),
      ).resolves.toBe('302 /base/a$&b → 404 404.html');
    });

    describe('stays on this host', () => {
      // Appended to the baseUrl
      const OpenRedirectPaths = [
        '/..//example.com/index',
        '/..//example.com/file.html',
        '//example.com/index',
        '//example.com/file',
        '//example.com/file.html',
      ];

      // See https://github.com/meta/docusaurus/pull/12879#discussion_r4493075460
      describe('with a baseUrl', () => {
        it('trailingSlash undefined', async () => {
          const result = await describeServing(
            {baseUrl: '/base/', trailingSlash: undefined},
            OpenRedirectPaths,
            {asIs: true},
          );
          expect(result).toMatchInlineSnapshot(`
            "/base/..//example.com/index      400 Bad Request
            /base/..//example.com/file.html  400 Bad Request
            /base//example.com/index         302 /base/example.com/index → 302 /base/example.com → 404 404.html
            /base//example.com/file          302 /base/example.com/file → 404 404.html
            /base//example.com/file.html     302 /base/example.com/file.html → 302 /base/example.com/file → 404 404.html"
          `);
        });

        it('trailingSlash true', async () => {
          const result = await describeServing(
            {baseUrl: '/base/', trailingSlash: true},
            OpenRedirectPaths,
            {asIs: true},
          );
          expect(result).toMatchInlineSnapshot(`
            "/base/..//example.com/index      400 Bad Request
            /base/..//example.com/file.html  400 Bad Request
            /base//example.com/index         302 /base/example.com/index → 302 /base/example.com → 404 404.html
            /base//example.com/file          302 /base/example.com/file → 302 /base/example.com/file/ → 404 404.html
            /base//example.com/file.html     302 /base/example.com/file.html → 302 /base/example.com/file → 302 /base/example.com/file/ → 404 404.html"
          `);
        });

        it('trailingSlash false', async () => {
          const result = await describeServing(
            {baseUrl: '/base/', trailingSlash: false},
            OpenRedirectPaths,
            {asIs: true},
          );
          expect(result).toMatchInlineSnapshot(`
            "/base/..//example.com/index      400 Bad Request
            /base/..//example.com/file.html  400 Bad Request
            /base//example.com/index         302 /base/example.com/index → 302 /base/example.com → 404 404.html
            /base//example.com/file          302 /base/example.com/file → 404 404.html
            /base//example.com/file.html     302 /base/example.com/file.html → 302 /base/example.com/file → 404 404.html"
          `);
        });
      });

      // Without a baseUrl, serve-handler handles these requests
      describe('without a baseUrl', () => {
        it('trailingSlash undefined', async () => {
          const result = await describeServing(
            {baseUrl: '/', trailingSlash: undefined},
            OpenRedirectPaths,
            {asIs: true},
          );
          expect(result).toMatchInlineSnapshot(`
            "/..//example.com/index      400 Bad Request
            /..//example.com/file.html  400 Bad Request
            //example.com/index         301 /example.com → 404 404.html
            //example.com/file          404 404.html
            //example.com/file.html     301 /example.com/file → 404 404.html"
          `);
        });

        it('trailingSlash true', async () => {
          const result = await describeServing(
            {baseUrl: '/', trailingSlash: true},
            OpenRedirectPaths,
            {asIs: true},
          );
          expect(result).toMatchInlineSnapshot(`
            "/..//example.com/index      400 Bad Request
            /..//example.com/file.html  400 Bad Request
            //example.com/index         301 /example.com → 404 404.html
            //example.com/file          301 /example.com/file → 301 /example.com/file/ → 404 404.html
            //example.com/file.html     301 /example.com/file → 301 /example.com/file/ → 404 404.html"
          `);
        });

        it('trailingSlash false', async () => {
          const result = await describeServing(
            {baseUrl: '/', trailingSlash: false},
            OpenRedirectPaths,
            {asIs: true},
          );
          expect(result).toMatchInlineSnapshot(`
            "/..//example.com/index      400 Bad Request
            /..//example.com/file.html  400 Bad Request
            //example.com/index         301 /example.com → 404 404.html
            //example.com/file          301 /example.com/file → 404 404.html
            //example.com/file.html     301 /example.com/file → 404 404.html"
          `);
        });
      });
    });

    it('keeps the baseUrl when merging slashes', async () => {
      await expect(
        serveRequest({baseUrl: '/base/', trailingSlash: false}, '/base//file'),
      ).resolves.toBe('302 /base/file → 200 file.html');
    });

    // TODO fix: keep the query string, "301 /file?query=1 → 200 file.html"
    it('drops the query string in serve-handler redirects', async () => {
      await expect(
        serveRequest(
          {baseUrl: '/', trailingSlash: undefined},
          '/file.html?query=1',
        ),
      ).resolves.toBe('301 /file → 200 file.html');
    });

    // TODO fix: serve docs/2.x/index.html, like the index.html of any folder
    // serve-handler doesn't look for it when the path has an extension (.x)
    it('does not serve folders with a dot in their name', async () => {
      await expect(
        serveRequest({baseUrl: '/', trailingSlash: undefined}, '/docs/2.x/'),
      ).resolves.toBe('404 404.html');
    });
  });
});
