/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import globby from 'globby';
import fs from 'fs';
import path from 'path';
import {encodePath, fileToPath, aliasedSitePath} from '@docusaurus/utils';
import {
  LoadContext,
  Plugin,
  OptionValidationContext,
  ValidationResult,
} from '@docusaurus/types';

import {PluginOptions, LoadedContent} from './types';
import {PluginOptionSchema} from './pluginOptionSchema';
import {ValidationError} from '@hapi/joi';

export default function pluginContentPages(
  context: LoadContext,
  options: PluginOptions,
): Plugin<LoadedContent | null, typeof PluginOptionSchema> {
  const contentPath = path.resolve(context.siteDir, options.path);

  return {
    name: 'docusaurus-plugin-content-pages',

    getPathsToWatch() {
      const {include = []} = options;
      const globPattern = include.map((pattern) => `${contentPath}/${pattern}`);
      return [...globPattern];
    },

    async loadContent() {
      const {include} = options;
      const {siteConfig, siteDir} = context;
      const pagesDir = contentPath;

      if (!fs.existsSync(pagesDir)) {
        return null;
      }

      const {baseUrl} = siteConfig;
      const pagesFiles = await globby(include, {
        cwd: pagesDir,
      });

      return pagesFiles.map((relativeSource) => {
        const source = path.join(pagesDir, relativeSource);
        const aliasedSource = aliasedSitePath(source, siteDir);
        const pathName = encodePath(fileToPath(relativeSource));
        // Default Language.
        return {
          permalink: pathName.replace(/^\//, baseUrl || ''),
          source: aliasedSource,
        };
      });
    },

    async contentLoaded({content, actions}) {
      if (!content) {
        return;
      }

      const {addRoute} = actions;

      await Promise.all(
        content.map(async (metadataItem) => {
          const {permalink, source} = metadataItem;
          addRoute({
            path: permalink,
            component: source,
            exact: true,
            modules: {
              config: `@generated/docusaurus.config`,
            },
          });
        }),
      );
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
