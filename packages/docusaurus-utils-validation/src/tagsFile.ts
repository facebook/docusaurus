/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';
import Joi from 'joi';
import YAML from 'js-yaml';
import type {
  TagsFile,
  TagsFileInput,
  TagsPluginOptions,
} from '@docusaurus/utils';

const TagsFileInputSchema = Joi.object<TagsFileInput>().pattern(
  Joi.string(),
  Joi.object({
    label: Joi.string(),
    description: Joi.string(),
    permalink: Joi.string(),
  }).allow(null),
);

export function ensureUniquePermalinks(tags: TagsFile): void {
  const permalinks = new Set<string>();
  const duplicates = new Set<string>();

  for (const [, tag] of Object.entries(tags)) {
    const {permalink} = tag;
    if (permalinks.has(permalink)) {
      duplicates.add(permalink);
    } else {
      permalinks.add(permalink);
    }
  }

  if (duplicates.size > 0) {
    const duplicateList = Array.from(duplicates)
      .map((permalink) => `  - ${permalink}`)
      .join('\n');
    throw new Error(
      `Duplicate permalinks found in tags file:\n${duplicateList}`,
    );
  }
}

export function normalizeTagsFile(data: TagsFileInput): TagsFile {
  return _.mapValues(data, (tag, key) => {
    return {
      label: tag?.label || _.capitalize(key),
      description: tag?.description,
      permalink: tag?.permalink || `/${_.kebabCase(key)}`,
    };
  });
}

export async function getTagsFile(
  options: TagsPluginOptions,
  contentPath: string,
): Promise<TagsFile | null> {
  if (options.tags === false || options.tags === null) {
    return null;
  }

  const filename = options.tags || 'tags.yml';
  const tagDefinitionPath = path.join(contentPath, filename);
  const isFileExists = await fs.pathExists(tagDefinitionPath);

  if (options.tags === undefined && !isFileExists) {
    return null;
  }

  const tagDefinitionContent = await fs.readFile(tagDefinitionPath, 'utf-8');
  if (!tagDefinitionContent.trim()) {
    throw new Error(`Tags file at path ${tagDefinitionPath} is empty`);
  }
  const yamlContent = YAML.load(tagDefinitionContent);
  const tagsFileInputResult = TagsFileInputSchema.validate(yamlContent);
  if (tagsFileInputResult.error) {
    throw new Error(
      `There was an error extracting tags from file: ${tagsFileInputResult.error.message}`,
      {cause: tagsFileInputResult},
    );
  }

  const tagsFile = normalizeTagsFile(tagsFileInputResult.value);
  ensureUniquePermalinks(tagsFile);

  return options.onInlineTags !== 'ignore' ? tagsFile : null;
}
