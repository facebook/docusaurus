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
import {validateShowcaseFrontMatter} from './frontMatter';
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

async function getTagsDefinition(
  filePath: string | TagOption[],
): Promise<string[]> {
  if (Array.isArray(filePath)) {
    return filePath.map((tag) => tag.label);
  }

  const rawYaml = await fs.readFile(filePath, 'utf-8');
  const unsafeYaml: any = Yaml.load(rawYaml);
  console.log('unsafeYaml:', unsafeYaml);

  const transformedData = unsafeYaml.tags.map((item: any) => {
    const [label] = Object.keys(item); // Extract label from object key
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const {description, color} = item[label]; // Extract description and color
    return {label, description, color}; // Create new object with transformed structure
  });
  console.log('transformedData:', transformedData);

  const safeYaml = tagSchema.validate(transformedData);

  if (safeYaml.error) {
    throw new Error(`Invalid tags.yaml file: ${safeYaml.error.message}`);
  }

  const tagLabels = safeYaml.value.map((tag: any) => Object.keys(tag)[0]);
  return tagLabels;
}

function createTagSchema(tags: string[]): Joi.Schema {
  return Joi.alternatives().try(
    Joi.string().valid(...tags), // Schema for single string
    Joi.array().items(Joi.string().valid(...tags)), // Schema for array of strings
  );
}

function validateFrontMatterTags(
  frontMatterTags: string[],
  tagListSchema: Joi.Schema,
): void {
  const result = tagListSchema.validate(frontMatterTags);
  if (result.error) {
    throw new Error(
      `Front matter contains invalid tags: ${result.error.message}`,
    );
  }
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
      const {include} = options;

      if (!(await fs.pathExists(contentPaths.contentPath))) {
        return null;
      }

      // const {baseUrl} = siteConfig;
      const showcaseFiles = await Globby(include, {
        cwd: contentPaths.contentPath,
        ignore: options.exclude,
      });

      const filteredShowcaseFiles = showcaseFiles.filter(
        (source) => source !== 'tags.yaml',
      );

      // todo refactor ugly
      const tagFilePath = path.join(
        await getFolderContainingFile(
          getContentPathList(contentPaths),
          'tags.yaml',
        ),
        'tags.yaml',
      );

      const tagList = await getTagsDefinition(tagFilePath);
      const createdTagSchema = createTagSchema(tagList);
      console.log('createdTagSchema:', createdTagSchema.describe());

      async function processShowcaseSourceFile(relativeSource: string) {
        // Lookup in localized folder in priority
        const contentPath = await getFolderContainingFile(
          getContentPathList(contentPaths),
          relativeSource,
        );

        const sourcePath = path.join(contentPath, relativeSource);

        const rawYaml = await fs.readFile(sourcePath, 'utf-8');
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
            {cause: err as Error},
          );
        }
      }

      return {
        items: await Promise.all(
          filteredShowcaseFiles.map(doProcessShowcaseSourceFile),
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
