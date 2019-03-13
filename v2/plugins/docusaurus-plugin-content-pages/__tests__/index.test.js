/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import loadSetup from '@test/loadSetup';
import DocusaurusPluginContentPages from '../index';

describe('docusaurus-plugin-content-pages', () => {
  describe('loadContents', () => {
    test.each([
      [
        'simple',
        pagesDir => [
          {
            permalink: '/',
            source: path.join(pagesDir, 'index.js'),
          },
          {
            permalink: '/hello/world',
            source: path.join(pagesDir, 'hello', 'world.js'),
          },
        ],
      ],
      [
        'versioned',
        pagesDir => [
          {
            permalink: '/',
            source: path.join(pagesDir, 'index.js'),
          },
          {
            permalink: '/hello/world',
            source: path.join(pagesDir, 'hello', 'world.js'),
          },
        ],
      ],
      [
        'translated',
        pagesDir => [
          {
            language: 'en',
            permalink: '/',
            source: path.join(pagesDir, 'index.js'),
          },
          {
            language: 'en',
            permalink: '/en/',
            source: path.join(pagesDir, 'index.js'),
          },
          {
            language: 'ko',
            permalink: '/ko/',
            source: path.join(pagesDir, 'index.js'),
          },
          {
            language: 'en',
            permalink: '/hello/world',
            source: path.join(pagesDir, 'hello', 'world.js'),
          },
          {
            language: 'en',
            permalink: '/en/hello/world',
            source: path.join(pagesDir, 'hello', 'world.js'),
          },
          {
            language: 'ko',
            permalink: '/ko/hello/world',
            source: path.join(pagesDir, 'hello', 'world.js'),
          },
        ],
        [
          'transversioned',
          pagesDir => [
            {
              language: 'en',
              permalink: '/',
              source: path.join(pagesDir, 'index.js'),
            },
            {
              language: 'en',
              permalink: '/en/',
              source: path.join(pagesDir, 'index.js'),
            },
            {
              language: 'ko',
              permalink: '/ko/',
              source: path.join(pagesDir, 'index.js'),
            },
            {
              language: 'en',
              permalink: '/hello/world',
              source: path.join(pagesDir, 'hello', 'world.js'),
            },
            {
              language: 'en',
              permalink: '/en/hello/world',
              source: path.join(pagesDir, 'hello', 'world.js'),
            },
            {
              language: 'ko',
              permalink: '/ko/hello/world',
              source: path.join(pagesDir, 'hello', 'world.js'),
            },
          ],
        ],
      ],
    ])('%s website', async (type, expected) => {
      const {env, siteDir, siteConfig} = await loadSetup(type);
      const plugin = new DocusaurusPluginContentPages(null, {
        env,
        siteDir,
        siteConfig,
      });
      const pagesMetadatas = await plugin.loadContents();
      const pagesDir = plugin.contentPath;

      expect(pagesMetadatas).toEqual(expected(pagesDir));
    });
  });
});
