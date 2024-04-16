/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {getPluginI18nPath} from '@docusaurus/utils';
import {createShowcaseItemSchema} from './validation';
import {getTagsList} from './tags';
import {processContentLoaded} from './lifecycle/contentLoaded';
import {processLoadContent} from './lifecycle/loadContent';
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

export default async function pluginContentShowcase(
  context: LoadContext,
  options: PluginOptions,
): Promise<Plugin<ShowcaseItems>> {
  const {siteDir, localizationDir} = context;
  // todo check for better naming of path: sitePath
  const {include, exclude, tags, routeBasePath, path: sitePath, id} = options;

  const contentPaths: ShowcaseContentPaths = {
    contentPath: path.resolve(siteDir, sitePath),
    contentPathLocalized: getPluginI18nPath({
      localizationDir,
      pluginName: 'docusaurus-plugin-content-pages',
      pluginId: id,
    }),
  };

  const tagList = await getTagsList({
    configTags: tags,
    configPath: contentPaths.contentPath,
  });

  const showcaseItemSchema = createShowcaseItemSchema(tagList);

  return {
    name: 'docusaurus-plugin-content-showcase',

    getPathsToWatch() {
      return getContentPathList(contentPaths).flatMap((contentPath) =>
        include.map((pattern) => `${contentPath}/${pattern}`),
      );
    },

    async loadContent(): Promise<ShowcaseItems> {
      if (!(await fs.pathExists(contentPaths.contentPath))) {
        throw new Error(
          `The showcase content path does not exist: ${contentPaths.contentPath}`,
        );
      }

      return processLoadContent({
        include,
        exclude,
        contentPaths,
        showcaseItemSchema,
      });
    },

    async contentLoaded({content, actions: {addRoute}}) {
      if (!content) {
        return;
      }

      await processContentLoaded({
        content,
        routeBasePath,
        addRoute,
      });
    },
  };
}

export {validateOptions} from './options';
