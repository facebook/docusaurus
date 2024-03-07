/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  isValidPathname,
  DEFAULT_PLUGIN_ID,
  type Tag,
  addLeadingSlash,
} from '@docusaurus/utils';
import Joi from './Joi';
import {JoiFrontMatter} from './JoiFrontMatter';
import {validateFrontMatter} from '.';
import type {BlogPostFrontMatter} from '@docusaurus/plugin-content-blog';
import type {DocFrontMatter} from '@docusaurus/plugin-content-docs';

export const PluginIdSchema = Joi.string()
  .regex(/^[\w-]+$/)
  .message(
    'Illegal plugin ID value "{#value}": it should only contain alphanumerics, underscores, and dashes.',
  )
  .default(DEFAULT_PLUGIN_ID);

const MarkdownPluginsSchema = Joi.array()
  .items(
    Joi.array().ordered(Joi.function().required(), Joi.any().required()),
    Joi.function(),
    Joi.object(),
  )
  .messages({
    'array.includes': `{#label} does not look like a valid MDX plugin config. A plugin config entry should be one of:
- A tuple, like \`[require("rehype-katex"), \\{ strict: false \\}]\`, or
- A simple module, like \`require("remark-math")\``,
  })
  .default([]);

export const RemarkPluginsSchema = MarkdownPluginsSchema;
export const RehypePluginsSchema = MarkdownPluginsSchema;

export const AdmonitionsSchema = JoiFrontMatter.alternatives()
  .try(
    JoiFrontMatter.boolean().required(),
    JoiFrontMatter.object({
      keywords: JoiFrontMatter.array().items(
        JoiFrontMatter.string(),
        // Apparently this is how we tell job to accept empty arrays...
        // .required(),
      ),
      extendDefaults: JoiFrontMatter.boolean(),

      // TODO Remove before 2024
      tag: Joi.any().forbidden().messages({
        'any.unknown': `It is not possible anymore to use a custom admonition tag. The only admonition tag supported is ':::' (Markdown Directive syntax)`,
      }),
    }).required(),
  )
  .default(true)
  .messages({
    'alternatives.types':
      '{{#label}} does not look like a valid admonitions config',
  });

// TODO how can we make this emit a custom error message :'(
//  Joi is such a pain, good luck to annoying trying to improve this
export const URISchema = Joi.alternatives(
  Joi.string().uri({allowRelative: true}),
  // This custom validation logic is required notably because Joi does not
  // accept paths like /a/b/c ...
  Joi.custom((val: unknown, helpers) => {
    if (typeof val !== 'string') {
      return helpers.error('any.invalid');
    }
    try {
      // eslint-disable-next-line no-new
      new URL(String(val));
      return val;
    } catch {
      return helpers.error('any.invalid');
    }
  }),
).messages({
  'alternatives.match':
    "{{#label}} does not look like a valid url (value='{{.value}}')",
});

export const PathnameSchema = Joi.string()
  .custom((val: string) => {
    if (!isValidPathname(val)) {
      throw new Error();
    }
    return val;
  })
  .message(
    '{{#label}} ({{#value}}) is not a valid pathname. Pathname should start with slash and not contain any domain or query string.',
  );

// Normalized schema for url path segments: baseUrl + routeBasePath...
// Note we only add a leading slash
// we don't always want to enforce a trailing slash on urls such as /docs
//
// Examples:
// '' => '/'
// 'docs' => '/docs'
// '/docs' => '/docs'
// 'docs/' => '/docs'
// 'prefix/docs' => '/prefix/docs'
// TODO tighter validation: not all strings are valid path segments
export const RouteBasePathSchema = Joi
  // Weird Joi trick needed, otherwise value '' is not normalized...
  .alternatives()
  .try(Joi.string().required().allow(''))
  .custom((value: string) =>
    // /!\ do not add trailing slash here
    addLeadingSlash(value),
  );

const FrontMatterTagSchema = JoiFrontMatter.alternatives()
  .try(
    JoiFrontMatter.string().required(),
    JoiFrontMatter.object<Tag>({
      label: JoiFrontMatter.string().required(),
      permalink: JoiFrontMatter.string().required(),
    }).required(),
  )
  .messages({
    'alternatives.match': '{{#label}} does not look like a valid tag',
    'alternatives.types': '{{#label}} does not look like a valid tag',
  });

export const FrontMatterTagsSchema = JoiFrontMatter.array()
  .items(FrontMatterTagSchema)
  .messages({
    'array.base':
      '{{#label}} does not look like a valid front matter Yaml array.',
  });

export const FrontMatterTOCHeadingLevels = {
  toc_min_heading_level: JoiFrontMatter.number().when('toc_max_heading_level', {
    is: JoiFrontMatter.exist(),
    then: JoiFrontMatter.number()
      .min(2)
      .max(JoiFrontMatter.ref('toc_max_heading_level')),
    otherwise: JoiFrontMatter.number().min(2).max(6),
  }),
  toc_max_heading_level: JoiFrontMatter.number().min(2).max(6),
};

export type ContentVisibility = {
  draft: boolean;
  unlisted: boolean;
};

export const ContentVisibilitySchema = JoiFrontMatter.object<ContentVisibility>(
  {
    draft: JoiFrontMatter.boolean(),
    unlisted: JoiFrontMatter.boolean(),
  },
)
  .custom((frontMatter: ContentVisibility, helpers) => {
    if (frontMatter.draft && frontMatter.unlisted) {
      return helpers.error('frontMatter.draftAndUnlistedError');
    }
    return frontMatter;
  })
  .messages({
    'frontMatter.draftAndUnlistedError':
      "Can't be draft and unlisted at the same time.",
  })
  .unknown();

export const FrontMatterAuthorErrorMessage =
  '{{#label}} does not look like a valid blog post author. Please use an author key or an author object (with a key and/or name).';

export const FrontMatterLastUpdateErrorMessage =
  '{{#label}} does not look like a valid last update object. Please use an author key with a string or a date with a string or Date.';

export const FrontMatterLastUpdateSchema = Joi.object({
  author: Joi.string(),
  date: Joi.date().raw(),
})
  .or('author', 'date')
  .messages({
    'object.missing': FrontMatterLastUpdateErrorMessage,
    'object.base': FrontMatterLastUpdateErrorMessage,
  });

const BlogPostFrontMatterAuthorSchema = Joi.object({
  key: Joi.string(),
  name: Joi.string(),
  title: Joi.string(),
  url: URISchema,
  imageURL: Joi.string(),
})
  .or('key', 'name', 'imageURL')
  .rename('image_url', 'imageURL', {alias: true});

// NOTE: we don't add any default value on purpose here
// We don't want default values to magically appear in doc metadata and props
// While the user did not provide those values explicitly
// We use default values in code instead
const DocFrontMatterSchema = Joi.object<DocFrontMatter>({
  id: Joi.string(),
  // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
  title: Joi.string().allow(''),
  hide_title: Joi.boolean(),
  hide_table_of_contents: Joi.boolean(),
  keywords: Joi.array().items(Joi.string().required()),
  image: URISchema,
  // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
  description: Joi.string().allow(''),
  slug: Joi.string(),
  sidebar_label: Joi.string(),
  sidebar_position: Joi.number(),
  sidebar_class_name: Joi.string(),
  sidebar_custom_props: Joi.object().unknown(),
  displayed_sidebar: Joi.string().allow(null),
  tags: FrontMatterTagsSchema,
  pagination_label: Joi.string(),
  custom_edit_url: URISchema.allow('', null),
  parse_number_prefixes: Joi.boolean(),
  pagination_next: Joi.string().allow(null),
  pagination_prev: Joi.string().allow(null),
  ...FrontMatterTOCHeadingLevels,
  last_update: FrontMatterLastUpdateSchema,
})
  .unknown()
  .concat(ContentVisibilitySchema);

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
  last_update: FrontMatterLastUpdateSchema,
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

export function validateDocFrontMatter(frontMatter: {
  [key: string]: unknown;
}): DocFrontMatter {
  return validateFrontMatter(frontMatter, DocFrontMatterSchema);
}
