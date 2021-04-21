/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  JoiFrontMatter as Joi, // Custom instance for frontmatter
  validateFrontMatter,
} from '@docusaurus/utils-validation';
import {Tag} from './types';

// TODO complete this frontmatter + add unit tests
export type BlogPostFrontMatter = {
  id?: string;
  title?: string;
  description?: string;
  tags?: (string | Tag)[];
  slug?: string;
  draft?: boolean;
  date?: string;
};

// NOTE: we don't add any default value on purpose here
// We don't want default values to magically appear in doc metadatas and props
// While the user did not provide those values explicitly
// We use default values in code instead
const BlogTagSchema = Joi.alternatives().try(
  Joi.string().required(),
  Joi.object<Tag>({
    label: Joi.string().required(),
    permalink: Joi.string().required(),
  }),
);

const BlogFrontMatterSchema = Joi.object<BlogPostFrontMatter>({
  id: Joi.string(),
  title: Joi.string().allow(''),
  description: Joi.string().allow(''),
  tags: Joi.array().items(BlogTagSchema),
  slug: Joi.string(),
  draft: Joi.boolean(),
  date: Joi.string().allow(''), // TODO validate the date better!
}).unknown();

export function validateBlogPostFrontMatter(
  frontMatter: Record<string, unknown>,
): BlogPostFrontMatter {
  return validateFrontMatter(frontMatter, BlogFrontMatterSchema);
}
