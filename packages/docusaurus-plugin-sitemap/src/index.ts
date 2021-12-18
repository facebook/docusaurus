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
import {
  LoadContext,
  Props,
  OptionValidationContext,
  ValidationResult,
  Plugin,
} from '@docusaurus/types';
import {PluginOptionSchema} from './pluginOptionSchema';

export default function pluginSitemap(
  _context: LoadContext,
  options: Options,
): Plugin<void> {
  return {
    name: 'docusaurus-plugin-sitemap',

    async postBuild({siteConfig, routesPaths, outDir}: Props) {
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

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options>): ValidationResult<Options> {
  const validatedOptions = validate(PluginOptionSchema, options);
  return validatedOptions;
}
