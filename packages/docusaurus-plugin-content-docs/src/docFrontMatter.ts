/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';

// TODO complete this frontmatter + add unit tests
type DocFrontMatter = {
  id?: string;
  title?: string;
  description?: string;
  slug?: string;
  sidebar_label?: string;
  custom_edit_url?: string;
};

const DocFrontMatterSchema = Joi.object<DocFrontMatter>({
  id: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
  slug: Joi.string(),
  sidebar_label: Joi.string(),
  custom_edit_url: Joi.string().allow(null),
}).unknown();

export function assertDocFrontMatter(
  frontMatter: Record<string, unknown>,
): asserts frontMatter is DocFrontMatter {
  Joi.attempt(frontMatter, DocFrontMatterSchema);
}
