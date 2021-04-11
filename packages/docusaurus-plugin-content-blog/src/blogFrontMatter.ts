/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import {Tag} from './types';

// TODO complete this frontmatter + add unit tests
type BlogPostFrontMatter = {
  id?: string;
  title?: string;
  description?: string;
  tags?: (string | Tag)[];
  slug?: string;
  draft?: boolean;
  date?: string;
};

const BlogTagSchema = Joi.alternatives().try(
  Joi.string().required(),
  Joi.object<Tag>({
    label: Joi.string().required(),
    permalink: Joi.string().required(),
  }),
);

const BlogFrontMatterSchema = Joi.object<BlogPostFrontMatter>({
  id: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
  tags: Joi.array().items(BlogTagSchema),
  slug: Joi.string(),
  draft: Joi.boolean(),
}).unknown();

export function assertBlogPostFrontMatter(
  frontMatter: Record<string, unknown>,
): asserts frontMatter is BlogPostFrontMatter {
  Joi.attempt(frontMatter, BlogFrontMatterSchema);
}
