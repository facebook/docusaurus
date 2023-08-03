/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi, PathnameSchema} from '@docusaurus/utils-validation';
import type {OptionValidationContext} from '@docusaurus/types';

export type RedirectOption = {
  /** Pathname of an existing Docusaurus page */
  to: string;
  /** Pathname of the new page(s) we should create */
  from: string | string[];
};

export type PluginOptions = {
  /** Plugin ID. */
  id: string;
  /** The extensions to be removed from the route after redirecting. */
  fromExtensions: string[];
  /** The extensions to be appended to the route after redirecting. */
  toExtensions: string[];
  /** The list of redirect rules, each one with multiple `from`s → one `to`. */
  redirects: RedirectOption[];
  /**
   * A callback to create a redirect rule. Docusaurus query this callback
   * against every path it has created, and use its return value to output more
   * paths.
   * @returns All the paths from which we should redirect to `path`
   */
  createRedirects?: (
    /** An existing Docusaurus route path */
    path: string,
  ) => string[] | string | null | undefined;
};

export type Options = Partial<PluginOptions>;

export const DEFAULT_OPTIONS: Partial<PluginOptions> = {
  fromExtensions: [],
  toExtensions: [],
  redirects: [],
};

const RedirectPluginOptionValidation = Joi.object<RedirectOption>({
  from: Joi.alternatives().try(
    PathnameSchema.required(),
    Joi.array().items(PathnameSchema.required()),
  ),
  to: Joi.string().required(),
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
  createRedirects: Joi.function().maxArity(1),
}).default(DEFAULT_OPTIONS);

export function validateOptions({
  validate,
  options: userOptions,
}: OptionValidationContext<Options | undefined, PluginOptions>): PluginOptions {
  return validate(UserOptionsSchema, userOptions);
}
