/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptions, RedirectOption, UserPluginOptions} from './types';
import * as Joi from 'joi';
import {PathnameSchema} from '@docusaurus/utils-validation';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/core/lib/constants';

export const DefaultPluginOptions: PluginOptions = {
  id: DEFAULT_PLUGIN_ID, // TODO temporary
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

const UserOptionsSchema = Joi.object<UserPluginOptions>({
  id: Joi.string().optional(), // TODO remove once validation  migrated to new system
  fromExtensions: Joi.array().items(isString),
  toExtensions: Joi.array().items(isString),
  redirects: Joi.array().items(RedirectPluginOptionValidation),
  createRedirects: Joi.function().arity(1),
});

function validateUserOptions(userOptions: UserPluginOptions) {
  const {error} = UserOptionsSchema.validate(userOptions, {
    abortEarly: true,
    allowUnknown: false,
  });
  if (error) {
    throw new Error(
      `Invalid @docusaurus/plugin-client-redirects options: ${error.message}
  ${JSON.stringify(userOptions, null, 2)}`,
    );
  }
}

export default function normalizePluginOptions(
  userPluginOptions: UserPluginOptions = {},
): PluginOptions {
  validateUserOptions(userPluginOptions);
  return {...DefaultPluginOptions, ...userPluginOptions};
}
