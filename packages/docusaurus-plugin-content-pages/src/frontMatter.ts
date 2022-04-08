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
} from '@docusaurus/utils-validation';
import type {FrontMatter} from '@docusaurus/plugin-content-pages';

const PageFrontMatterSchema = Joi.object<FrontMatter>({
  title: Joi.string(),
  description: Joi.string(),
  wrapperClassName: Joi.string(),
  hide_table_of_contents: Joi.boolean(),
  ...FrontMatterTOCHeadingLevels,
});

export function validatePageFrontMatter(frontMatter: {
  [key: string]: unknown;
}): FrontMatter {
  return validateFrontMatter(frontMatter, PageFrontMatterSchema);
}
