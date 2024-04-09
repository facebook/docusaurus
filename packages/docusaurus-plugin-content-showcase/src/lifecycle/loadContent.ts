/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import Yaml from 'js-yaml';
import {
  Globby,
  getContentPathList,
  getFolderContainingFile,
} from '@docusaurus/utils';
import {validateShowcaseItem} from '../validation';
import type {ShowcaseContentPaths} from '../types';
import type {ShowcaseItems} from '@docusaurus/plugin-content-showcase';

export async function processLoadContent({
  include,
  exclude,
  contentPaths,
  showcaseItemSchema,
}: {
  include: string[];
  exclude: string[];
  contentPaths: ShowcaseContentPaths;
  showcaseItemSchema: any;
}): Promise<ShowcaseItems | null> {
  const showcaseFiles = await Globby(include, {
    cwd: contentPaths.contentPath,
    ignore: [...exclude],
  });

  async function processShowcaseSourceFile(relativeSource: string) {
    // Lookup in localized folder in priority
    const contentPath = await getFolderContainingFile(
      getContentPathList(contentPaths),
      relativeSource,
    );

    const sourcePath = path.join(contentPath, relativeSource);
    const data = await fs.readFile(sourcePath, 'utf-8');
    const item = Yaml.load(data);
    const showcaseItem = validateShowcaseItem({
      item,
      showcaseItemSchema,
    });

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
    items: await Promise.all(showcaseFiles.map(doProcessShowcaseSourceFile)),
  };
}
