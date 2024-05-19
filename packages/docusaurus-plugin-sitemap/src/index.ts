/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import logger from '@docusaurus/logger';
import createSitemap from './createSitemap';
import type {PluginOptions, Options} from './options';
import type {LoadContext, Plugin} from '@docusaurus/types';

const PluginName = 'docusaurus-plugin-sitemap';

export default function pluginSitemap(
  context: LoadContext,
  options: PluginOptions,
): Plugin<void> {
  if (context.siteConfig.future.experimental_router === 'hash') {
    logger.warn(
      `${PluginName} does not support the Hash Router and will be disabled.`,
    );
    return {name: PluginName};
  }

  return {
    name: PluginName,

    async postBuild({siteConfig, routes, outDir, head}) {
      if (siteConfig.noIndex) {
        return;
      }
      // Generate sitemap.
      const generatedSitemap = await createSitemap({
        siteConfig,
        routes,
        head,
        options,
      });
      if (!generatedSitemap) {
        return;
      }

      // Write sitemap file.
      const sitemapPath = path.join(outDir, options.filename);
      try {
        await fs.outputFile(sitemapPath, generatedSitemap);
      } catch (err) {
        logger.error('Writing sitemap failed.');
        throw err;
      }
    },
  };
}

export {validateOptions} from './options';
export type {PluginOptions, Options};
