/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  JoiFrontMatter as Joi, // Custom instance for front matter
  URISchema,
  validateFrontMatter,
  FrontMatterTagsSchema,
  FrontMatterTOCHeadingLevels,
  ContentVisibilitySchema,
} from '@docusaurus/utils-validation';
import {
  FrontMatterAuthorErrorMessage,
  FrontMatterLastUpdateErrorMessage,
} from '@docusaurus/utils/lib/lastUpdateUtils';
import type {BlogPostFrontMatter} from '@docusaurus/plugin-content-blog';

const BlogPostFrontMatterAuthorSchema = Joi.object({
  key: Joi.string(),
  name: Joi.string(),
  title: Joi.string(),
  url: URISchema,
  imageURL: Joi.string(),
})
  .or('key', 'name', 'imageURL')
  .rename('image_url', 'imageURL', {alias: true});

const BlogFrontMatterSchema = Joi.object<BlogPostFrontMatter>({
  id: Joi.string(),
  title: Joi.string().allow(''),
  description: Joi.string().allow(''),
  tags: FrontMatterTagsSchema,
  date: Joi.date().raw(),

  // New multi-authors front matter:
  authors: Joi.alternatives()
    .try(
      Joi.string(),
      BlogPostFrontMatterAuthorSchema,
      Joi.array()
        .items(Joi.string(), BlogPostFrontMatterAuthorSchema)
        .messages({
          'array.sparse': FrontMatterAuthorErrorMessage,
          'array.includes': FrontMatterAuthorErrorMessage,
        }),
    )
    .messages({
      'alternatives.match': FrontMatterAuthorErrorMessage,
    }),
  // Legacy author front matter
  author: Joi.string(),
  author_title: Joi.string(),
  author_url: URISchema,
  author_image_url: URISchema,
  // TODO enable deprecation warnings later
  authorURL: URISchema,
  // .warning('deprecate.error', { alternative: '"author_url"'}),
  authorTitle: Joi.string(),
  // .warning('deprecate.error', { alternative: '"author_title"'}),
  authorImageURL: URISchema,
  // .warning('deprecate.error', { alternative: '"author_image_url"'}),

  slug: Joi.string(),
  image: URISchema,
  keywords: Joi.array().items(Joi.string().required()),
  hide_table_of_contents: Joi.boolean(),

  ...FrontMatterTOCHeadingLevels,
  last_update: Joi.object({
    author: Joi.string(),
    date: Joi.date().raw(),
  })
    .or('author', 'date')
    .messages({
      'object.missing': FrontMatterLastUpdateErrorMessage,
      'object.base': FrontMatterLastUpdateErrorMessage,
    }),
})
  .messages({
    'deprecate.error':
      '{#label} blog frontMatter field is deprecated. Please use {#alternative} instead.',
  })
  .concat(ContentVisibilitySchema);

export function validateBlogPostFrontMatter(frontMatter: {
  [key: string]: unknown;
}): BlogPostFrontMatter {
  return validateFrontMatter(frontMatter, BlogFrontMatterSchema);
}
