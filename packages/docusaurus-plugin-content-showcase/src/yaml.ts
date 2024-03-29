/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi, validateFrontMatter} from '@docusaurus/utils-validation';
import type {ShowcaseFrontMatter} from '@docusaurus/plugin-content-showcase';

const showcaseFrontMatterSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  preview: Joi.string().required(),
  website: Joi.string().required(),
  source: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
});

export function validateShowcaseFrontMatter(frontMatter: {
  [key: string]: unknown;
}): ShowcaseFrontMatter {
  return validateFrontMatter(frontMatter, showcaseFrontMatterSchema);
}
