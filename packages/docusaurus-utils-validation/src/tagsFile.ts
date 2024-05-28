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
  Tag,
  TagsFile,
  TagsFileInput,
  TagsPluginOptions,
} from '@docusaurus/utils';

const tagDefinitionSchema = Joi.object<TagsFile>().pattern(
  Joi.string(),
  Joi.object({
    label: Joi.string(),
    description: Joi.string(),
    permalink: Joi.string(),
  }).allow(null),
);

function validateDefinedTags(tags: unknown): Joi.ValidationResult<TagsFile> {
  return tagDefinitionSchema.validate(tags);
}

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
    throw new Error(
      `Duplicate permalinks found: ${Array.from(duplicates).join(', ')}`,
    );
  }
}

export function normalizeTagsFile(data: TagsFileInput): TagsFile {
  const normalizedData: TagsFile = {};
  for (const [key, tag] of Object.entries(data)) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Use type assertion to tell TypeScript that tag is of type Partial<Tag>
      const partialTag = tag as Partial<Tag>;
      normalizedData[key] = {
        label: partialTag?.label || _.capitalize(key),
        description: partialTag?.description || `${key} default description`,
        permalink: _.kebabCase(partialTag?.permalink) || `/${_.kebabCase(key)}`,
      };
    }
  }

  return normalizedData;
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
  // TODO is it fine to use as TagsFileInput?
  const data = YAML.load(tagDefinitionContent) as TagsFileInput;
  const definedTags = validateDefinedTags(data);

  if (definedTags.error) {
    throw new Error(
      `There was an error extracting tags from file: ${definedTags.error.message}`,
      {cause: definedTags},
    );
  }

  if (options.onInlineTags !== 'ignore') {
    // TODO + normalize partial input => full input
    // TODO unit tests covering all forms of partial inputs
    // TODO handle conflicts, verify unique permalink etc
    const normalizedData = normalizeTagsFile(definedTags.value);

    ensureUniquePermalinks(normalizedData);

    return normalizedData;
  }

  return null;
}
