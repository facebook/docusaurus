/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {isValidPathname, DEFAULT_PLUGIN_ID, type Tag} from '@docusaurus/utils';
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

const LegacyAdmonitionConfigSchema = Joi.forbidden().messages({
  'any.unknown': `The Docusaurus admonitions system has changed, and the option {#label} does not exist anymore.
You now need to swizzle the admonitions component to provide UI customizations such as icons.
Please refer to https://github.com/facebook/docusaurus/pull/7152 for detailed upgrade instructions.`,
});

export const AdmonitionsSchema = JoiFrontMatter.alternatives()
  .try(
    JoiFrontMatter.boolean().required(),
    JoiFrontMatter.object({
      tag: JoiFrontMatter.string(),
      keywords: JoiFrontMatter.array().items(
        JoiFrontMatter.string().required(),
      ),
      // TODO Remove before 2023
      customTypes: LegacyAdmonitionConfigSchema,
      icons: LegacyAdmonitionConfigSchema,
      infima: LegacyAdmonitionConfigSchema,
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
    '{{#label}} is not a valid pathname. Pathname should start with slash and not contain any domain or query string.',
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
