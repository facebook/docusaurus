/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  PluginOptions,
  RedirectOption,
} from '@docusaurus/plugin-client-redirects';
import type {
  OptionValidationContext,
  ValidationResult,
} from '@docusaurus/types';
import {Joi, PathnameSchema} from '@docusaurus/utils-validation';

export const DEFAULT_OPTIONS: Partial<PluginOptions> = {
  fromExtensions: [],
  toExtensions: [],
  redirects: [],
};

const RedirectPluginOptionValidation = Joi.object<RedirectOption>({
  to: PathnameSchema.required(),
  from: Joi.alternatives().try(
    PathnameSchema.required(),
    Joi.array().items(PathnameSchema.required()),
  ),
});

const isString = Joi.string().required().not(null);

const UserOptionsSchema = Joi.object<PluginOptions>({
  fromExtensions: Joi.array()
    .items(isString)
    .default(DEFAULT_OPTIONS.fromExtensions),
  toExtensions: Joi.array()
    .items(isString)
    .default(DEFAULT_OPTIONS.toExtensions),
  redirects: Joi.array()
    .items(RedirectPluginOptionValidation)
    .default(DEFAULT_OPTIONS.redirects),
  createRedirects: Joi.function().arity(1),
}).default(DEFAULT_OPTIONS);

export function validateOptions({
  validate,
  options: userOptions,
}: OptionValidationContext<PluginOptions>): ValidationResult<PluginOptions> {
  return validate(UserOptionsSchema, userOptions);
}
