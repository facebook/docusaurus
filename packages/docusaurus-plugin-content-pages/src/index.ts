/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import globby from 'globby';
import fs from 'fs';
import path from 'path';
import {encodePath, fileToPath} from '@docusaurus/utils';
import {LoadContext, Plugin} from '@docusaurus/types';

import {PluginOptions, LoadedContent} from './types';

const DEFAULT_OPTIONS: PluginOptions = {
  path: 'src/pages', // Path to data on filesystem, relative to site dir.
  routeBasePath: '', // URL Route.
  include: ['**/*.{js,jsx}'], // Extensions to include.
};

export default function pluginContentPages(
  context: LoadContext,
  opts: Partial<PluginOptions>,
): Plugin<LoadedContent | null> {
  const options = {...DEFAULT_OPTIONS, ...opts};
  const contentPath = path.resolve(context.siteDir, options.path);

  return {
    name: 'docusaurus-plugin-content-pages',

    getPathsToWatch() {
      const {include = []} = options;
      const globPattern = include.map(pattern => `${contentPath}/${pattern}`);
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

      return pagesFiles.map(relativeSource => {
        const source = path.join(pagesDir, relativeSource);
        // Cannot use path.join() as it resolves '../' and removes the '@site'. Let webpack loader resolve it.
        const aliasedSource = `@site/${path.relative(siteDir, source)}`;
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
        content.map(async metadataItem => {
          const {permalink, source} = metadataItem;
          addRoute({
            path: permalink,
            component: source,
            exact: true,
          });
        }),
      );
    },
  };
}
