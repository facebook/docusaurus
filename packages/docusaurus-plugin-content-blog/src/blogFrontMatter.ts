/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  JoiFrontMatter as Joi, // Custom instance for frontmatter
  URISchema,
  validateFrontMatter,
  FrontMatterTagsSchema,
} from '@docusaurus/utils-validation';
import type {FrontMatterTag} from '@docusaurus/utils';

export type BlogPostFrontMatter = {
  /* eslint-disable camelcase */
  id?: string;
  title?: string;
  description?: string;
  tags?: FrontMatterTag[];
  slug?: string;
  draft?: boolean;
  date?: Date | string; // Yaml automagically convert some string patterns as Date, but not all

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
  /* eslint-enable camelcase */
};

const BlogFrontMatterSchema = Joi.object<BlogPostFrontMatter>({
  id: Joi.string(),
  title: Joi.string().allow(''),
  description: Joi.string().allow(''),
  tags: FrontMatterTagsSchema,
  draft: Joi.boolean(),
  date: Joi.date().raw(),

  author: Joi.string(),
  author_title: Joi.string(),
  author_url: URISchema,
  author_image_url: URISchema,
  slug: Joi.string(),
  image: URISchema,
  keywords: Joi.array().items(Joi.string().required()),
  hide_table_of_contents: Joi.boolean(),

  // TODO re-enable warnings later, our v1 blog posts use those older frontmatter fields
  authorURL: URISchema,
  // .warning('deprecate.error', { alternative: '"author_url"'}),
  authorTitle: Joi.string(),
  // .warning('deprecate.error', { alternative: '"author_title"'}),
  authorImageURL: URISchema,
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
