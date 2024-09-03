/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import type {ThemeConfig} from '@docusaurus/theme-mermaid';
import type {ThemeConfigValidationContext} from '@docusaurus/types';

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mermaid: {
    theme: {
      dark: 'dark',
      light: 'default',
    },
    options: {},
  },
};

export const Schema = Joi.object<ThemeConfig>({
  mermaid: Joi.object({
    theme: Joi.object({
      dark: Joi.string().default(DEFAULT_THEME_CONFIG.mermaid.theme.dark),
      light: Joi.string().default(DEFAULT_THEME_CONFIG.mermaid.theme.light),
    }).default(DEFAULT_THEME_CONFIG.mermaid.theme),
    options: Joi.object().default(DEFAULT_THEME_CONFIG.mermaid.options),
  }).default(DEFAULT_THEME_CONFIG.mermaid),
});

export function validateThemeConfig({
  validate,
  themeConfig,
}: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
  return validate(Schema, themeConfig);
}
