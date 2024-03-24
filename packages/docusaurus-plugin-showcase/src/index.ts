/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import fs from 'fs-extra';
import path from 'path';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import Yaml from 'js-yaml';

import {contentAuthorsSchema} from './options';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions, Content} from '@docusaurus/plugin-showcase';

export default function pluginContentShowcase(
  context: LoadContext,
  options: PluginOptions,
): Plugin<Content> {
  const {siteConfig, siteDir, generatedFilesDir} = context;

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-showcase',
  );
  const dataDir = path.join(pluginDataDirRoot, options.id ?? DEFAULT_PLUGIN_ID);

  return {
    name: 'docusaurus-plugin-showcase',

    // getPathsToWatch() {
    //   return [path.join(siteDir, options.path, 'authors.yaml')];
    // },

    async loadContent(): Promise<Content> {
      const files = await fs.readdir(path.join(siteDir, options.path));
      const yamlFiles = files.filter((file) => file.endsWith('.yaml'));

      const contentPromises = yamlFiles.map(async (file) => {
        const rawYaml = await fs.readFile(
          path.join(siteDir, options.path, file),
          'utf-8',
        );
        const yaml = Yaml.load(rawYaml);
        const parsedYaml = contentAuthorsSchema.validate(yaml);

        if (parsedYaml.error) {
          throw new Error(`Validation failed: ${parsedYaml.error.message}`, {
            cause: parsedYaml.error,
          });
        }

        const {title, description, preview, website, source, tags} =
          parsedYaml.value;

        return {
          title,
          description,
          preview,
          website,
          source,
          tags,
        };
      });

      const content = await Promise.all(contentPromises);
      return {
        website: content,
      };
    },

    async contentLoaded({content, actions}) {
      if (!content) {
        return;
      }

      const {addRoute, createData} = actions;

      await Promise.all(
        content.website.map(async (item) => {
          const dataAuthor = await createData(
            `${item.title}.json`,
            JSON.stringify(item),
          );

          addRoute({
            path: `/showcaseAll/${item.title}`,
            component: '@theme/Showcase',
            modules: {
              content: dataAuthor,
            },
            exact: true,
          });
        }),
      );

      const showcaseAllData = await createData(
        'showcaseAll.json',
        JSON.stringify(content.website),
      );

      addRoute({
        path: '/showcaseAll',
        component: '@theme/Showcase',
        modules: {
          content: showcaseAllData,
        },
        exact: true,
      });
    },
  };
}

export {validateOptions} from './options';
