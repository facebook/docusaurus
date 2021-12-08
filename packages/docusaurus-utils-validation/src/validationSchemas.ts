/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Joi from './Joi';
import {isValidPathname, DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import type {Tag} from '@docusaurus/utils';
import {JoiFrontMatter} from './JoiFrontMatter';

export const PluginIdSchema = Joi.string()
  .regex(/^[a-zA-Z_-]+$/)
  .default(DEFAULT_PLUGIN_ID);

const MarkdownPluginsSchema = Joi.array()
  .items(
    Joi.array().ordered(Joi.function().required(), Joi.object().required()),
    Joi.function(),
    Joi.object(),
  )
  .default([]);

export const RemarkPluginsSchema = MarkdownPluginsSchema;
export const RehypePluginsSchema = MarkdownPluginsSchema;

export const AdmonitionsSchema = Joi.object().default({});

// TODO how can we make this emit a custom error message :'(
//  Joi is such a pain, good luck to annoying trying to improve this
export const URISchema = Joi.alternatives(
  Joi.string().uri({allowRelative: true}),
  // This custom validation logic is required notably because Joi does not accept paths like /a/b/c ...
  Joi.custom((val, helpers) => {
    try {
      const url = new URL(val);
      if (url) {
        return val;
      } else {
        return helpers.error('any.invalid');
      }
    } catch {
      return helpers.error('any.invalid');
    }
  }),
).messages({
  'alternatives.match':
    "{{#label}} does not look like a valid url (value='{{.value}}')",
});

export const PathnameSchema = Joi.string()
  .custom((val) => {
    if (!isValidPathname(val)) {
      throw new Error();
    } else {
      return val;
    }
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
      '{{#label}} does not look like a valid FrontMatter Yaml array.',
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
