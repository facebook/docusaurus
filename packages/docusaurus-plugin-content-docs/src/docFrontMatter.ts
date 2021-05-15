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

export type DocFrontMatter = {
  id?: string;
  title?: string;
  hide_title?: boolean;
  hide_table_of_contents?: boolean;
  keywords?: string[];
  image?: string;
  description?: string;
  slug?: string;
  sidebar_label?: string;
  sidebar_position?: number;
  custom_edit_url?: string | null;
  parse_number_prefixes?: boolean;
};

// NOTE: we don't add any default value on purpose here
// We don't want default values to magically appear in doc metadatas and props
// While the user did not provide those values explicitly
// We use default values in code instead
const DocFrontMatterSchema = Joi.object<DocFrontMatter>({
  id: Joi.string(),
  title: Joi.string().allow(''), // see https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
  hide_title: Joi.boolean(),
  hide_table_of_contents: Joi.boolean(),
  keywords: Joi.array().items(Joi.string().required()),
  image: Joi.string().uri({allowRelative: false}),
  description: Joi.string().allow(''), // see  https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
  slug: Joi.string(),
  sidebar_label: Joi.string(),
  sidebar_position: Joi.number().min(0),
  custom_edit_url: Joi.string().uri({allowRelative: true}).allow('', null),
  parse_number_prefixes: Joi.boolean(),
}).unknown();

export function validateDocFrontMatter(
  frontMatter: Record<string, unknown>,
): DocFrontMatter {
  return validateFrontMatter(frontMatter, DocFrontMatterSchema);
}
