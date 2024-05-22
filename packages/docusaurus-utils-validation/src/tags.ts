/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Joi from 'joi';
import type {TagsFile} from '@docusaurus/utils';

export const tagDefinitionSchema = Joi.object<TagsFile>().pattern(
  Joi.string(),
  Joi.object({
    label: Joi.string().required(),
    description: Joi.string().required(),
    permalink: Joi.string(),
  }),
);

export function validateDefinedTags(
  tags: unknown,
): Joi.ValidationResult<TagsFile> {
  return tagDefinitionSchema.validate(tags);
}
