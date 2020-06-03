/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  PluginOptions,
  RedirectOption,
  RedirectsCreator,
  UserPluginOptions,
} from './types';
import * as Yup from 'yup';
import {PathnameValidator} from './redirectValidation';

export const DefaultPluginOptions: PluginOptions = {
  fromExtensions: [],
  toExtensions: [],
  redirects: [],
};

function isRedirectsCreator(value: any): value is RedirectsCreator | undefined {
  if (value === null || typeof value === 'undefined') {
    return true;
  }
  return value instanceof Function;
}

const RedirectPluginOptionValidation = Yup.object<RedirectOption>({
  to: PathnameValidator.required(),
  // See https://stackoverflow.com/a/62177080/82609
  from: Yup.lazy<string | string[]>((from) => {
    return Array.isArray(from)
      ? Yup.array().of(PathnameValidator.required()).required()
      : PathnameValidator.required();
  }),
});

const UserOptionsSchema = Yup.object().shape<UserPluginOptions>({
  fromExtensions: Yup.array().of(Yup.string().required().min(0)),
  toExtensions: Yup.array().of(Yup.string().required().min(0)),
  redirects: Yup.array().of(RedirectPluginOptionValidation) as any, // TODO Yup expect weird typing here
  createRedirects: Yup.mixed().test(
    'createRedirects',
    'createRedirects should be a function',
    isRedirectsCreator,
  ),
});

function validateUserOptions(userOptions: UserPluginOptions) {
  try {
    UserOptionsSchema.validateSync(userOptions, {
      strict: true,
      abortEarly: true,
    });
  } catch (e) {
    throw new Error(
      `Invalid @docusaurus/plugin-client-redirects options: ${e.message}
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
