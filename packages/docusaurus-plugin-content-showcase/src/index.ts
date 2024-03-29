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

import {validateShowcaseFrontMatter} from './frontMatter';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions, Content} from '@docusaurus/plugin-content-showcase';
import type {ShowcaseContentPaths} from './types';

export function getContentPathList(
  contentPaths: ShowcaseContentPaths,
): string[] {
  return [contentPaths.contentPathLocalized, contentPaths.contentPath];
}

export default function pluginContentShowcase(
  context: LoadContext,
  options: PluginOptions,
): Plugin<Content | null> {
  const {siteDir, localizationDir} = context;

  const contentPaths: ShowcaseContentPaths = {
    contentPath: path.resolve(siteDir, options.path),
    contentPathLocalized: getPluginI18nPath({
      localizationDir,
      pluginName: 'docusaurus-plugin-content-pages',
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

    async loadContent(): Promise<Content | null> {
      const {include} = options;

      if (!(await fs.pathExists(contentPaths.contentPath))) {
        return null;
      }

      // const {baseUrl} = siteConfig;
      const showcaseFiles = await Globby(include, {
        cwd: contentPaths.contentPath,
        ignore: options.exclude,
      });

      async function processShowcaseSourceFile(relativeSource: string) {
        // Lookup in localized folder in priority
        const contentPath = await getFolderContainingFile(
          getContentPathList(contentPaths),
          relativeSource,
        );

        const sourcePath = path.join(contentPath, relativeSource);
        const rawYaml = await fs.readFile(sourcePath, 'utf-8');
        const unsafeYaml = Yaml.load(rawYaml) as {[key: string]: unknown};
        return validateShowcaseFrontMatter(unsafeYaml);
      }

      async function doProcessShowcaseSourceFile(relativeSource: string) {
        try {
          return await processShowcaseSourceFile(relativeSource);
        } catch (err) {
          throw new Error(
            `Processing of page source file path=${relativeSource} failed.`,
            {cause: err as Error},
          );
        }
      }

      return {
        website: await Promise.all(
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
        JSON.stringify(content.website),
      );

      addRoute({
        path: '/showcaseAll',
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
