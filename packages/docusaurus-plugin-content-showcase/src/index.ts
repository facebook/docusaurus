/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {
  getFolderContainingFile,
  getPluginI18nPath,
  Globby,
} from '@docusaurus/utils';
import Yaml from 'js-yaml';
import {Joi} from '@docusaurus/utils-validation';
import {validateFrontMatterTags, validateShowcaseItem} from './validation';
import {getTagsList} from './tags';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {
  PluginOptions,
  ShowcaseItems,
} from '@docusaurus/plugin-content-showcase';
import type {ShowcaseContentPaths} from './types';

export function getContentPathList(
  contentPaths: ShowcaseContentPaths,
): string[] {
  return [contentPaths.contentPathLocalized, contentPaths.contentPath];
}

function createTagSchema(tags: string[]): Joi.Schema {
  return Joi.array().items(Joi.string().valid(...tags)); // Schema for array of strings
}

export default function pluginContentShowcase(
  context: LoadContext,
  options: PluginOptions,
): Plugin<ShowcaseItems | null> {
  const {siteDir, localizationDir} = context;

  const contentPaths: ShowcaseContentPaths = {
    contentPath: path.resolve(siteDir, options.path),
    contentPathLocalized: getPluginI18nPath({
      localizationDir,
      pluginName: 'docusaurus-plugin-content-showcase',
      pluginId: options.id,
    }),
  };

  return {
    name: 'docusaurus-plugin-content-showcase',

    // todo doesn't work
    // getPathsToWatch() {
    //   const {include} = options;
    //   return getContentPathList(contentPaths).flatMap((contentPath) =>
    //     include.map((pattern) => `${contentPath}/${pattern}`),
    //   );
    // },

    async loadContent(): Promise<ShowcaseItems | null> {
      if (!(await fs.pathExists(contentPaths.contentPath))) {
        throw new Error(
          `The showcase content path does not exist: ${contentPaths.contentPath}`,
        );
      }

      const {include} = options;

      const showcaseFiles = await Globby(include, {
        cwd: contentPaths.contentPath,
        ignore: [...options.exclude],
      });

      const tagList = await getTagsList({
        configTags: options.tags,
        configPath: contentPaths.contentPath,
      });
      const createdTagSchema = createTagSchema(tagList);

      async function processShowcaseSourceFile(relativeSource: string) {
        // Lookup in localized folder in priority
        const contentPath = await getFolderContainingFile(
          getContentPathList(contentPaths),
          relativeSource,
        );

        const sourcePath = path.join(contentPath, relativeSource);
        const data = await fs.readFile(sourcePath, 'utf-8');
        const unsafeData = Yaml.load(data);
        const showcaseItem = validateShowcaseItem(unsafeData);

        validateFrontMatterTags(showcaseItem.tags, createdTagSchema);

        return showcaseItem;
      }

      async function doProcessShowcaseSourceFile(relativeSource: string) {
        try {
          return await processShowcaseSourceFile(relativeSource);
        } catch (err) {
          throw new Error(
            `Processing of page source file path=${relativeSource} failed.`,
            {cause: err},
          );
        }
      }

      return {
        items: await Promise.all(
          showcaseFiles.map(doProcessShowcaseSourceFile),
        ),
      };
    },

    async contentLoaded({content, actions}) {
      if (!content) {
        return;
      }

      const {addRoute, createData} = actions;

      const showcaseAllData = await createData(
        'showcaseAll.json',
        JSON.stringify(content.items),
      );

      addRoute({
        path: options.routeBasePath,
        component: '@theme/Showcase',
        modules: {
          content: showcaseAllData,
          // img: '@site/src/showcase/website/ozaki/aot.jpg',
        },
        exact: true,
      });
    },
  };
}

export {validateOptions} from './options';
