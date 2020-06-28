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
import {
  LoadContext,
  Props,
  OptionValidationContext,
  ValidationResult,
  Plugin,
} from '@docusaurus/types';
import {PluginOptionSchema} from './pluginOptionSchema';
import {ValidationError} from '@hapi/joi';

export default function pluginSitemap(
  _context: LoadContext,
  options: PluginOptions,
): Plugin<void> {
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

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<PluginOptions, ValidationError>): ValidationResult<
  PluginOptions,
  ValidationError
> {
  const validatedOptions = validate(PluginOptionSchema, options);
  return validatedOptions;
}
