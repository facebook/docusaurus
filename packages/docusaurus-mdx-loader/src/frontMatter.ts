/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  JoiFrontMatter as Joi,
  validateFrontMatter,
} from '@docusaurus/utils-validation';

import type {FormatInput} from './index';

export type MDXFrontMatter = {
  format?: FormatInput;
};

export const DefaultMDXFrontMatter: MDXFrontMatter = {
  format: undefined,
};

const MDXFrontMatterSchema = Joi.object<MDXFrontMatter>({
  format: Joi.string().equal('md', 'mdx', 'detect').optional(),
}).default(DefaultMDXFrontMatter);

export function validateMDXFrontMatter(frontMatter: unknown): MDXFrontMatter {
  return validateFrontMatter(frontMatter, MDXFrontMatterSchema, {
    allowUnknown: false,
  });
}
