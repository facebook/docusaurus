/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import loadSetup from '../../../docusaurus/lib/server/load/__tests__/loadSetup';
import DocusaurusPluginContentPages from '../index';

describe('docusaurus-plugin-content-pages', () => {
  describe('loadContent', () => {
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
    ])('%s website', async (type, expected) => {
      const {siteDir, siteConfig} = await loadSetup(type);
      const plugin = new DocusaurusPluginContentPages({
        siteDir,
        siteConfig,
      });
      const pagesMetadatas = await plugin.loadContent();
      const pagesDir = plugin.contentPath;

      expect(pagesMetadatas).toEqual(expected(pagesDir));
    });
  });
});
