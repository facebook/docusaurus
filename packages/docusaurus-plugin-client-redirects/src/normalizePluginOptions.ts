/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptions, RedirectOption, UserPluginOptions} from './types';
import * as Joi from '@hapi/joi';
import {PathnameValidator} from './redirectValidation';

export const DefaultPluginOptions: PluginOptions = {
  fromExtensions: [],
  toExtensions: [],
  redirects: [],
};

const RedirectPluginOptionValidation = Joi.object<RedirectOption>({
  to: PathnameValidator.required(),
  from: Joi.alternatives().try(
    PathnameValidator.required(),
    Joi.array().items(PathnameValidator.required()),
  ),
});

const isString = Joi.string().required().not(null);

const UserOptionsSchema = Joi.object<UserPluginOptions>({
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
