/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi, validateFrontMatter} from '@docusaurus/utils-validation';
import {createTagSchema} from './tags';
import type {ShowcaseItem} from '@docusaurus/plugin-content-showcase';

const showcaseItemSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  preview: Joi.string().required(),
  website: Joi.string().required(),
  source: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
});

export function validateShowcaseItem({
  item,
  tags,
}: {
  item: unknown;
  tags: string[];
}): ShowcaseItem {
  const tagsSchema = createTagSchema(tags);

  const result = tagsSchema.validate(tags);
  if (result.error) {
    throw new Error(`Front matter contains invalid tags`, {
      cause: result.error,
    });
  }

  return validateFrontMatter(item, showcaseItemSchema);
}
