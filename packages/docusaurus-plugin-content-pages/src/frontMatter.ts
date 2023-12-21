/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Joi,
  validateFrontMatter,
  FrontMatterTOCHeadingLevels,
  ContentVisibilitySchema,
  URISchema,
} from '@docusaurus/utils-validation';
import type {PageFrontMatter} from '@docusaurus/plugin-content-pages';

const PageFrontMatterSchema = Joi.object<PageFrontMatter>({
  // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
  title: Joi.string().allow(''),
  // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
  description: Joi.string().allow(''),
  keywords: Joi.array().items(Joi.string().required()),
  image: URISchema,
  wrapperClassName: Joi.string(),
  hide_table_of_contents: Joi.boolean(),
  ...FrontMatterTOCHeadingLevels,
}).concat(ContentVisibilitySchema);

export function validatePageFrontMatter(frontMatter: {
  [key: string]: unknown;
}): PageFrontMatter {
  return validateFrontMatter(frontMatter, PageFrontMatterSchema);
}
