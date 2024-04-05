/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi, validateFrontMatter} from '@docusaurus/utils-validation';
import {createTagSchema} from './tags';
import type {ShowcaseItem} from '@docusaurus/plugin-content-showcase';

const createShowcaseItemSchema = (tags: string[]) => {
  const tagsSchema = createTagSchema(tags);

  return Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    preview: Joi.string().required(),
    website: Joi.string().required(),
    source: Joi.string().required(),
    tags: tagsSchema,
  });
};

export function validateShowcaseItem({
  item,
  tags,
}: {
  item: unknown;
  tags: string[];
}): ShowcaseItem {
  const showcaseItemSchema = createShowcaseItemSchema(tags);

  return validateFrontMatter(item, showcaseItemSchema);
}
