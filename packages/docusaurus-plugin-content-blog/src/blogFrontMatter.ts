/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */

import {
  JoiFrontMatter as Joi, // Custom instance for frontmatter
  validateFrontMatter,
} from '@docusaurus/utils-validation';
import {Tag} from './types';

export type BlogPostFrontMatter = {
  id?: string;
  title?: string;
  description?: string;
  tags?: (string | Tag)[];
  slug?: string;
  draft?: boolean;
  date?: Date;

  author?: string;
  author_title?: string;
  author_url?: string;
  author_image_url?: string;

  image?: string;
  keywords?: string[];
  hide_table_of_contents?: boolean;

  /** @deprecated */
  authorTitle?: string;
  authorURL?: string;
  authorImageURL?: string;
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
  draft: Joi.boolean(),
  date: Joi.date().raw(),

  author: Joi.string(),
  author_title: Joi.string(),
  author_url: Joi.string().uri(),
  author_image_url: Joi.string().uri(),
  slug: Joi.string(),
  image: Joi.string().uri({relativeOnly: true}),
  keywords: Joi.array().items(Joi.string().required()),
  hide_table_of_contents: Joi.boolean(),

  // TODO re-enable warnings later, our v1 blog posts use those older frontmatter fields
  authorURL: Joi.string().uri(),
  // .warning('deprecate.error', { alternative: '"author_url"'}),
  authorTitle: Joi.string(),
  // .warning('deprecate.error', { alternative: '"author_title"'}),
  authorImageURL: Joi.string().uri(),
  // .warning('deprecate.error', { alternative: '"author_image_url"'}),
})
  .unknown()
  .messages({
    'deprecate.error':
      '{#label} blog frontMatter field is deprecated. Please use {#alternative} instead.',
  });

export function validateBlogPostFrontMatter(
  frontMatter: Record<string, unknown>,
): BlogPostFrontMatter {
  return validateFrontMatter(frontMatter, BlogFrontMatterSchema);
}
