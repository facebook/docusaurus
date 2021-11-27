/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import chalk from 'chalk';
import Yaml from 'js-yaml';
import path from 'path';
import {findFolderContainingFile, Tag} from '@docusaurus/utils';
import {Joi} from '@docusaurus/utils-validation';
import {BlogContentPaths} from './types';
import {getContentPathList} from './blogUtils';

export type TagsMap = Record<string, Tag>;

type TagsMapParams = {
  tagsMapPath: string | undefined;
  contentPaths: BlogContentPaths;
};

type TagsParam = {
  tags: Tag[];
  failOnUnlisted: boolean;
  tagsMap: TagsMap | undefined;
  blogSource: string;
};

const TagsMapSchema = Joi.object<TagsMap>().pattern(
  Joi.string(),
  Joi.object({
    label: Joi.string().required(),
  })
    .unknown()
    .required(),
);

export function validateTags(params: TagsParam): void {
  if (!params.tags.length) {
    // No tags are given so there is nothing to compare
    return;
  }

  const {tagsMap, failOnUnlisted, blogSource} = params;

  if (!tagsMap) {
    throw new Error(`Can't validate blog post tags because no tags map file could be loaded.
Please double-check your blog plugin config (in particular 'tagsMapPath'), ensure the file exists at the configured path, is not empty, and is valid!`);
  }

  const invalidTags = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const tag of params.tags) {
    const {label} = tag;
    if (!Object.keys(tagsMap).includes(label)) {
      if (failOnUnlisted) {
        throw Error(`Blog tag "${label}" in ${blogSource} not found in the tags map file.
Valid tags are:
${Object.keys(tagsMap)
  .map((validKey) => `- ${validKey}`)
  .join('\n')}`);
      } else {
        invalidTags.push(label);
      }
    }
  }
  if (invalidTags.length) {
    console.warn(
      chalk.yellow(`At least one tag in ${blogSource} is unlisted:
Unlisted tags: 
${invalidTags.map((tag) => `- ${tag}`).join(`\n`)}

Allowed tags are:
${Object.keys(tagsMap)
  .map((validKey) => `- ${validKey}`)
  .join('\n')}
          
If you wish to fail your build on unlisted tags, set 'failOnUnlistedTags' to 'true'.\n`),
    );
  }
}

// TODO: This can be refactored into the authors logic (same code)
export async function getTagsMap(
  params: TagsMapParams,
): Promise<TagsMap | undefined> {
  if (!params.tagsMapPath) {
    return undefined;
  }
  const filePath = await getTagsMapFilePath(params);
  if (!filePath) {
    return undefined;
  }
  try {
    return await readTagsMapFile(filePath);
  } catch (e) {
    // TODO replace later by error cause, see https://v8.dev/features/error-cause
    console.error(
      chalk.yellow(`Couldn't read blog tags map at path ${filePath}`),
    );
    throw e;
  }
}

// TODO: This can be refactored into the authors logic (same code)
async function getTagsMapFilePath({
  tagsMapPath,
  contentPaths,
}: TagsMapParams): Promise<string | undefined> {
  if (!tagsMapPath) {
    return undefined;
  }
  // Useful to load an eventually localize tags map
  const contentPath = await findFolderContainingFile(
    getContentPathList(contentPaths),
    tagsMapPath,
  );
  if (contentPath) {
    return path.join(contentPath, tagsMapPath);
  } else {
    // If a file is specified but does not exist, the build must break
    throw new Error(
      `The tags file you specified can not be found, make sure ${tagsMapPath} is within the context ${contentPaths.contentPath}.`,
    );
  }
}

// TODO: This can be refactored into the authors logic (same code)
async function readTagsMapFile(filePath: string): Promise<TagsMap | undefined> {
  if (await fs.pathExists(filePath)) {
    const contentString = await fs.readFile(filePath, {encoding: 'utf8'});
    try {
      const unsafeContent = Yaml.load(contentString);
      return validateTagsMapFile(unsafeContent);
    } catch (e) {
      // TODO replace later by error cause: see https://v8.dev/features/error-cause
      console.error(chalk.red('The tags list file looks invalid!'));
      throw e;
    }
  }
  return undefined;
}

// TODO: This can be refactored into the authors logic (same code)
function validateTagsMapFile(content: unknown): TagsMap {
  return Joi.attempt(content, TagsMapSchema);
}
