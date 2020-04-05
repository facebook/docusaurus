/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import {PluginOptions} from './types';
import createSitemap from './createSitemap';
import {LoadContext, Props} from '@docusaurus/types';

const DEFAULT_OPTIONS: PluginOptions = {
  cacheTime: 600 * 1000, // 600 sec - cache purge period.
  changefreq: 'weekly',
  priority: 0.5,
};

export default function pluginSitemap(
  _context: LoadContext,
  opts: Partial<PluginOptions>,
) {
  const options = {...DEFAULT_OPTIONS, ...opts};

  return {
    name: 'docusaurus-plugin-sitemap',

    async postBuild({siteConfig, routesPaths, outDir}: Props) {
      // Generate sitemap.
      const generatedSitemap = createSitemap(
        siteConfig,
        routesPaths,
        options,
      ).toString();

      // Write sitemap file.
      const sitemapPath = path.join(outDir, 'sitemap.xml');
      try {
        fs.writeFileSync(sitemapPath, generatedSitemap);
      } catch (err) {
        throw new Error(`Sitemap error: ${err}`);
      }
    },
  };
}
