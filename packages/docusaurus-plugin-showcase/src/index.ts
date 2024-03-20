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

    async loadContent() {
      const authors = await fs.readJson(
        path.join(siteDir, options.path, 'authors.json'),
      );
      return authors;
    },

    async contentLoaded({content, actions}) {
      if (!content) {
        return;
      }

      const {addRoute, createData} = actions;

      const dataAuthor = await createData(
        'authors.json', // what is this?
        JSON.stringify(content),
      );

      addRoute({
        path: '/showcasetes',
        // component: '@site/src/components/Showcase.js',
        component: '@theme/Showcase',
        modules: {
          content: dataAuthor,
        },
        exact: true,
      });
    },
  };
}

export {validateOptions} from './options';
