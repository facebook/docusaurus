/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  isValidPathname,
  DEFAULT_PLUGIN_ID,
  type FrontMatterTag,
} from '@docusaurus/utils';
import {addLeadingSlash} from '@docusaurus/utils-common';
import Joi from './Joi';
import {JoiFrontMatter} from './JoiFrontMatter';

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
export const RecmaPluginsSchema = MarkdownPluginsSchema;

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
    // TODO Docusaurus v4 remove this legacy front matter tag object form
    //  users should use tags.yml instead
    JoiFrontMatter.object<FrontMatterTag>({
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
