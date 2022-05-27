/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import type {
  ThemeConfig,
  ThemeConfigValidationContext,
} from '@docusaurus/types';

export const Schema = Joi.object<ThemeConfig>({
  mermaid: Joi.object({
    theme: Joi.object({
      dark: Joi.string().optional(),
      light: Joi.string().optional(),
    }).optional(),
    config: Joi.object().optional(),
  })
    .label('themeConfig.mermaid')
    .optional(),
});

export function validateThemeConfig({
  validate,
  themeConfig,
}: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
  return validate(Schema, themeConfig);
}
