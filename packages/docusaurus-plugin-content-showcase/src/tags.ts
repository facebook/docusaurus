/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import Yaml from 'js-yaml';
import {Joi} from '@docusaurus/utils-validation';
import type {
  PluginOptions,
  TagsOption,
} from '@docusaurus/plugin-content-showcase';

export const tagSchema = Joi.object().pattern(
  Joi.string(),
  Joi.object({
    label: Joi.string().required(),
    description: Joi.object({
      message: Joi.string().required(),
      id: Joi.string().required(),
    }).required(),
    color: Joi.string()
      .pattern(/^#[\dA-Fa-f]{6}$/)
      .required()
      .messages({
        'string.pattern.base':
          'Color must be a hexadecimal color string (e.g., #14cfc3 #E9669E)',
      }),
  }),
);

export async function getTagsList({
  configTags,
  configPath,
}: {
  configTags: PluginOptions['tags'];
  configPath: PluginOptions['path'];
}): Promise<{tagkeys: string[]; tags: TagsOption}> {
  if (typeof configTags === 'object') {
    const tags = tagSchema.validate(configTags);
    if (tags.error) {
      throw new Error(
        `There was an error extracting tags: ${tags.error.message}`,
        {cause: tags},
      );
    }
    return {
      tagkeys: Object.keys(tags.value),
      tags: tags.value,
    };
  }

  const tagsPath = path.resolve(configPath, configTags);

  try {
    const data = await fs.readFile(tagsPath, 'utf-8');
    const unsafeData = Yaml.load(data);
    const tags = tagSchema.validate(unsafeData);

    if (tags.error) {
      throw new Error(
        `There was an error extracting tags: ${tags.error.message}`,
        {cause: tags},
      );
    }

    return {
      tagkeys: Object.keys(tags.value),
      tags: tags.value,
    };
  } catch (error) {
    throw new Error(`Failed to read tags file for showcase`, {cause: error});
  }
}

export function createTagSchema(tags: string[]): Joi.Schema {
  return Joi.array().items(Joi.string().valid(...tags));
}
