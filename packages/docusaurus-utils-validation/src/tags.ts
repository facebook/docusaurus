/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import Joi from 'joi';
import YAML from 'js-yaml';
import type {Tag, TagsFile, TagsFileInput} from '@docusaurus/utils';

// Tags plugins options shared between docs/blog
export type TagsPluginOptions = {
  // TODO rename to tags?
  // TODO allow option tags later? | TagsFile;
  tagsFilePath: string | false | null | undefined;
  // TODO rename to onInlineTags
  onUnknownTags: 'ignore' | 'log' | 'warn' | 'throw';
};

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

function ensureUniquePermalinks(tags: TagsFile) {
  const permalinks = new Set<string>();
  for (const [, tag] of Object.entries(tags)) {
    const {permalink} = tag;
    if (permalinks.has(permalink)) {
      throw new Error(`Duplicate permalink found: ${permalink}`);
    }
    permalinks.add(permalink);
  }
}

function normalizeTags(data: TagsFileInput): TagsFile {
  const normalizedData: TagsFile = {};
  for (const [key, tag] of Object.entries(data)) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Use type assertion to tell TypeScript that tag is of type Partial<Tag>
      const partialTag = tag as Partial<Tag>;
      normalizedData[key] = {
        label: partialTag.label || key,
        description: partialTag.description || `${key} description`,
        permalink: partialTag.permalink || `/${key}`,
      };
    }
  }

  return normalizedData;
}

export async function getTagsFile(
  options: TagsPluginOptions,
  contentPath: string,
  // TODO find a better solution
): Promise<TagsFile | null> {
  if (
    options.tagsFilePath === false ||
    options.tagsFilePath === null ||
    // TODO doesn't work if not set
    options.onUnknownTags === 'ignore' // TODO that looks wrong
  ) {
    return null;
  }
  const tagDefinitionPath = path.join(
    contentPath,
    // TODO default value isn't used ?
    options.tagsFilePath ? options.tagsFilePath : 'tags.yml',
  );
  const tagDefinitionContent = await fs.readFile(tagDefinitionPath, 'utf-8');
  // TODO is it fine?
  const data = YAML.load(tagDefinitionContent) as TagsFileInput;
  const normalizedData = normalizeTags(data);

  // return validateDefinedTags(data);
  // TODO + normalize partial input => full input
  // TODO unit tests covering all forms of partial inputs
  // TODO handle conflicts, verify unique permalink etc
  const definedTags = validateDefinedTags(normalizedData);
  if (definedTags.error) {
    throw new Error(
      `There was an error extracting tags from file: ${definedTags.error.message}`,
      {cause: definedTags},
    );
  }
  ensureUniquePermalinks(definedTags.value);

  return definedTags.value;
}
