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
import type {Author} from './types';

export type BlogPostFrontMatter = {
  /* eslint-disable camelcase */
  id?: string;
  title?: string;
  description?: string;
  tags?: FrontMatterTag[];
  slug?: string;
  draft?: boolean;
  date?: Date | string; // Yaml automagically convert some string patterns as Date, but not all

  author?: string | Author;
  author_title?: string;
  author_url?: string;
  author_image_url?: string;
  author_key?: string;
  author_keys?: string[];
  authors?: Author[];
  /** @deprecated */
  authorTitle?: string;
  /** @deprecated */
  authorURL?: string;
  /** @deprecated */
  authorImageURL?: string;

  image?: string;
  keywords?: string[];
  hide_table_of_contents?: boolean;
  /* eslint-enable camelcase */
};

const BlogFrontMatterBaseSchema = Joi.object({
  id: Joi.string(),
  title: Joi.string().allow(''),
  description: Joi.string().allow(''),
  tags: FrontMatterTagsSchema,
  draft: Joi.boolean(),
  date: Joi.date().raw(),
  slug: Joi.string(),
  image: URISchema,
  keywords: Joi.array().items(Joi.string().required()),
  hide_table_of_contents: Joi.boolean(),
});

const AuthorSchema = Joi.object({
  name: Joi.string(),
  title: Joi.string(),
  url: URISchema,
  imageURL: Joi.string(),
}).rename('image_url', 'imageURL');

// All possible ways to declare blog post authors.
const AuthorFrontMatterSchemas = [
  Joi.object({
    author_key: Joi.string(),
    author: Joi.string(),
    author_title: Joi.string(),
    author_url: URISchema,
    author_image_url: URISchema,
    authorTitle: Joi.string().warning('deprecate.error', {
      alternative: '"author_title"',
    }),
    authorURL: URISchema.warning('deprecate.error', {
      alternative: '"author_url"',
    }),
    authorImageURL: URISchema.warning('deprecate.error', {
      alternative: '"author_image_url"',
    }),

    author_keys: Joi.forbidden(),
    authors: Joi.forbidden(),
  }).messages({
    'deprecate.error':
      '{#label} blog front matter field is deprecated. Please use {#alternative} instead.',
  }),
  Joi.object({
    author_key: Joi.string(),
    author: AuthorSchema,

    author_title: Joi.forbidden(),
    author_url: Joi.forbidden(),
    author_image_url: Joi.forbidden(),
    author_keys: Joi.forbidden(),
    authors: Joi.forbidden(),
    authorTitle: Joi.forbidden(),
    authorURL: Joi.forbidden(),
    authorImageURL: Joi.forbidden(),
  }),
  Joi.object({
    author_keys: Joi.array().items(Joi.string()),
    authors: Joi.array().items(AuthorSchema.allow(null)),

    author: Joi.forbidden(),
    author_key: Joi.forbidden(),
    author_title: Joi.forbidden(),
    author_url: Joi.forbidden(),
    author_image_url: Joi.forbidden(),
    authorTitle: Joi.forbidden(),
    authorURL: Joi.forbidden(),
    authorImageURL: Joi.forbidden(),
  }),
];

const BlogFrontMatterSchema = Joi.object()
  .when('.', {
    switch: AuthorFrontMatterSchemas.map((schema) => {
      return {
        is: schema,
        then: BlogFrontMatterBaseSchema,
      };
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown':
        "The author declaration doesn't match any of the accepted formats. Visit  for more details. Note that the fields are not allowed to be empty.",
    }),
  })
  .unknown();

export function validateBlogPostFrontMatter(
  frontMatter: Record<string, unknown>,
): BlogPostFrontMatter {
  return validateFrontMatter(frontMatter, BlogFrontMatterSchema);
}
