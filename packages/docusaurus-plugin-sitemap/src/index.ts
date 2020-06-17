/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {PluginOptions} from './types';
import createSitemap from './createSitemap';
import {LoadContext, Props, OptionValidationContext} from '@docusaurus/types';
import {PluginOptionSchema} from './validation';

export default function pluginSitemap(
  _context: LoadContext,
  options: PluginOptions,
) {
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
        await fs.outputFile(sitemapPath, generatedSitemap);
      } catch (err) {
        throw new Error(`Sitemap error: ${err}`);
      }
    },
  };
}

pluginSitemap.validateOptions = ({
  validate,
  options,
}: OptionValidationContext<typeof PluginOptionSchema>) => {
  const validatedOptions = validate(PluginOptionSchema, options);
  return validatedOptions;
};
