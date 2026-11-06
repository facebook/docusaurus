/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {
  describeRequests,
  describeServing,
  serveRequest,
  type ServeOptions,
} from './testUtils';

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

  // A folder with a dot, like a docs version
  '/docs/2.x',
  '/docs/2.x/',

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
      const result = await describeServing(
        {baseUrl: '/base/', trailingSlash: undefined},
        RequestPaths,
      );
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
        /base/docs/2.x                   404 404.html
        /base/docs/2.x/                  404 404.html
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

    // Windows serves file URLs with a trailing slash, other platforms 404
    // TODO merge once looksLikeAsset is fixed and doesn't add one to files
    it.skipIf(process.platform === 'win32')('trailingSlash true', async () => {
      const result = await describeServing(
        {baseUrl: '/base/', trailingSlash: true},
        RequestPaths,
      );
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
        /base/docs/2.x                   404 404.html
        /base/docs/2.x/                  404 404.html
        /base/assets/css/styles.css      200 assets/css/styles.css
        /base/assets/css/styles.css?v=1  302 /base/assets/css/styles.css/?v=1 → 404 404.html
        /base/assets/                    404 404.html
        /base/assets/files/main.c        200 assets/files/main.c
        /base/assets/files/document.pdf  200 assets/files/document.pdf
        /base/assets/images/photo.jpeg   200 assets/images/photo.jpeg
        /base/assets/fonts/font.woff2    302 /base/assets/fonts/font.woff2/ → 404 404.html
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

    it.skipIf(process.platform !== 'win32')(
      'trailingSlash true, on Windows',
      async () => {
        const result = await describeServing(
          {baseUrl: '/base/', trailingSlash: true},
          RequestPaths,
        );
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
          /base/docs/2.x                   404 404.html
          /base/docs/2.x/                  404 404.html
          /base/assets/css/styles.css      200 assets/css/styles.css
          /base/assets/css/styles.css?v=1  302 /base/assets/css/styles.css/?v=1 → 200 assets/css/styles.css
          /base/assets/                    404 404.html
          /base/assets/files/main.c        200 assets/files/main.c
          /base/assets/files/document.pdf  200 assets/files/document.pdf
          /base/assets/images/photo.jpeg   200 assets/images/photo.jpeg
          /base/assets/fonts/font.woff2    302 /base/assets/fonts/font.woff2/ → 200 assets/fonts/font.woff2
          /base/site.webmanifest           302 /base/site.webmanifest/ → 200 site.webmanifest
          /base/missing                    302 /base/missing/ → 404 404.html
          /base/missing/                   404 404.html
          /base/missing.html               301 /missing → 302 /base/ → 200 index.html
          /base/file?query=1               302 /base/file/?query=1 → 200 file.html
          /base/file/?query=1              200 file.html
          /base/file.html?query=1          302 /base/file.html/?query=1 → 200 file.html
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
      },
    );

    it('trailingSlash false', async () => {
      const result = await describeServing(
        {baseUrl: '/base/', trailingSlash: false},
        RequestPaths,
      );
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
        /base/docs/2.x                   404 404.html
        /base/docs/2.x/                  302 /base/docs/2.x → 404 404.html
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

  // These tests capture the buggy behavior, also visible in the snapshots above
  describe('known bugs', () => {
    // TODO fix: serve café.html instead of crashing the server process
    // See https://github.com/vercel/serve-handler/issues/205
    it('crashes on file names with Latin-1 characters', async () => {
      await expect(
        serveRequest({baseUrl: '/', trailingSlash: undefined}, '/café'),
      ).resolves.toBe('crash ERR_INVALID_CHAR');
    });

    // TODO fix: keep the baseUrl, "301 /base/file → 200 file.html"
    // See https://github.com/meta/docusaurus/issues/10078#issuecomment-2084932934
    it('drops the baseUrl in serve-handler redirects', async () => {
      await expect(
        serveRequest(
          {baseUrl: '/base/', trailingSlash: undefined},
          '/base/file.html',
        ),
      ).resolves.toBe('301 /file → 302 /base/ → 200 index.html');
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

    // TODO fix: serve these assets without adding a trailing slash
    // The looksLikeAsset regex misses them
    // See https://github.com/meta/docusaurus/pull/10090
    // Windows serves file URLs with a trailing slash, other platforms 404
    describe('adds a trailing slash to some assets under a baseUrl', () => {
      const options: ServeOptions = {baseUrl: '/base/', trailingSlash: true};

      it.skipIf(process.platform === 'win32')(
        'with a query string',
        async () => {
          await expect(
            serveRequest(options, '/base/assets/css/styles.css?v=1'),
          ).resolves.toBe(
            '302 /base/assets/css/styles.css/?v=1 → 404 404.html',
          );
        },
      );

      it.skipIf(process.platform !== 'win32')(
        'with a query string, on Windows',
        async () => {
          await expect(
            serveRequest(options, '/base/assets/css/styles.css?v=1'),
          ).resolves.toBe(
            '302 /base/assets/css/styles.css/?v=1 → 200 assets/css/styles.css',
          );
        },
      );

      it.skipIf(process.platform === 'win32')(
        'with an extension longer than 4 characters',
        async () => {
          await expect(
            serveRequest(options, '/base/assets/fonts/font.woff2'),
          ).resolves.toBe('302 /base/assets/fonts/font.woff2/ → 404 404.html');
          await expect(
            serveRequest(options, '/base/site.webmanifest'),
          ).resolves.toBe('302 /base/site.webmanifest/ → 404 404.html');
        },
      );

      it.skipIf(process.platform !== 'win32')(
        'with an extension longer than 4 characters, on Windows',
        async () => {
          await expect(
            serveRequest(options, '/base/assets/fonts/font.woff2'),
          ).resolves.toBe(
            '302 /base/assets/fonts/font.woff2/ → 200 assets/fonts/font.woff2',
          );
          await expect(
            serveRequest(options, '/base/site.webmanifest'),
          ).resolves.toBe('302 /base/site.webmanifest/ → 200 site.webmanifest');
        },
      );
    });
  });
});
