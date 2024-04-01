/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {
  aliasedSitePathToRelativePath,
  getFolderContainingFile,
  getPluginI18nPath,
  Globby,
} from '@docusaurus/utils';
import Yaml from 'js-yaml';

import {Joi} from '@docusaurus/utils-validation';
import {
  validateFrontMatterTags,
  validateShowcaseFrontMatter,
} from './frontMatter';
import {tagSchema} from './options';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {
  PluginOptions,
  ShowcaseItem,
  TagOption,
} from '@docusaurus/plugin-content-showcase';
import type {ShowcaseContentPaths} from './types';

export function getContentPathList(
  contentPaths: ShowcaseContentPaths,
): string[] {
  return [contentPaths.contentPathLocalized, contentPaths.contentPath];
}

function createTagSchema(tags: string[]): Joi.Schema {
  return Joi.alternatives().try(
    Joi.string().valid(...tags), // Schema for single string
    Joi.array().items(Joi.string().valid(...tags)), // Schema for array of strings
  );
}

async function getTagsList(filePath: string | TagOption[]): Promise<string[]> {
  if (typeof filePath === 'object') {
    return Object.keys(filePath);
  }

  const rawYaml = await fs.readFile(
    // todo should we use aliasedPath ?
    // because it breaks tests showcase/index.test.ts#L27-L28
    aliasedSitePathToRelativePath(filePath),
    'utf-8',
  );
  const unsafeYaml = Yaml.load(rawYaml);
  const safeYaml = tagSchema.validate(unsafeYaml);

  if (safeYaml.error) {
    throw new Error(
      `There was an error extracting tags: ${safeYaml.error.message}`,
      {cause: safeYaml.error},
    );
  }

  const tagLabels = Object.keys(safeYaml.value);
  return tagLabels;
}

export default function pluginContentShowcase(
  context: LoadContext,
  options: PluginOptions,
): Plugin<ShowcaseItem | null> {
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

    async loadContent(): Promise<ShowcaseItem | null> {
      if (!(await fs.pathExists(contentPaths.contentPath))) {
        return null;
      }
      console.log('contentPaths:', contentPaths);

      const {include} = options;

      const showcaseFiles = await Globby(include, {
        cwd: contentPaths.contentPath,
        ignore: options.exclude,
      });

      const tagList = await getTagsList(options.tags);
      const createdTagSchema = createTagSchema(tagList);

      async function processShowcaseSourceFile(relativeSource: string) {
        // Lookup in localized folder in priority
        const contentPath = await getFolderContainingFile(
          getContentPathList(contentPaths),
          relativeSource,
        );

        const sourcePath = path.join(contentPath, relativeSource);

        const rawYaml = await fs.readFile(sourcePath, 'utf-8');
        // todo remove as ... because bad practice ?
        const unsafeYaml = Yaml.load(rawYaml) as {[key: string]: unknown};
        const yaml = validateShowcaseFrontMatter(unsafeYaml);

        validateFrontMatterTags(yaml.tags, createdTagSchema);

        return yaml;
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
