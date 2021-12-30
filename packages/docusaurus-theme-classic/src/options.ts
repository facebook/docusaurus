/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import type {
  ValidationResult,
  OptionValidationContext,
} from '@docusaurus/types';
import type {Options} from '@docusaurus/theme-classic';

const DEFAULT_OPTIONS: Options = {
  customCss: null,
};

export const Schema = Joi.object({
  customCss: Joi.alternatives()
    .try(Joi.array().items(Joi.string().required()), Joi.string().required())
    .optional()
    .default(DEFAULT_OPTIONS.customCss)
    .warning('deprecate.error', {
      msg: `theme.customCss option is deprecated.
Please use siteConfig.style.css instead.

Note that this also changes the CSS insertion order!
This enables your site CSS to override default theme CSS more easily, without using !important

Before: custom site CSS was inserted before Infima CSS and theme modules.
After: custom site CSS will be inserted after Infima CSS and theme modules.

See also https://github.com/facebook/docusaurus/pull/6227
`,
    })
    .messages({
      'deprecate.error': '{#msg}',
    }),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options>): ValidationResult<Options> {
  return validate(Schema, options);
}
