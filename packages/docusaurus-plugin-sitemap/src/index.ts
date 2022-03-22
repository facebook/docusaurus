/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import type {Options} from '@docusaurus/plugin-sitemap';
import createSitemap from './createSitemap';
import type {LoadContext, Plugin} from '@docusaurus/types';

export default function pluginSitemap(
  context: LoadContext,
  options: Options,
): Plugin<void> {
  return {
    name: 'docusaurus-plugin-sitemap',

    async postBuild({siteConfig, routesPaths, outDir}) {
      if (siteConfig.noIndex) {
        return;
      }
      // Generate sitemap.
      const generatedSitemap = await createSitemap(
        siteConfig,
        routesPaths,
        options,
      );

      // Write sitemap file.
      const sitemapPath = path.join(outDir, 'sitemap.xml');
      try {
        await fs.outputFile(sitemapPath, generatedSitemap);
      } catch (err) {
        throw new Error(`Writing sitemap failed: ${err}`);
      }
    },
  };
}

export {validateOptions} from './options';
