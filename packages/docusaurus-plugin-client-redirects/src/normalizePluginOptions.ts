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
  // wasn't able to use .when("from")...had cyclic dependency error
  // (https://stackoverflow.com/a/56866941/82609)
  from: Yup.mixed<string | string[]>().test({
    name: 'from',
    message: '${path} contains invalid redirection value',
    test: (from) => {
      return Array.isArray(from)
        ? Yup.array()
            .of(PathnameValidator.required())
            .required()
            .isValidSync(from)
        : PathnameValidator.required().isValidSync(from);
    },
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
  UserOptionsSchema.validateSync(userOptions, {
    abortEarly: true,
    strict: true,
  });
}

export default function normalizePluginOptions(
  userPluginOptions: UserPluginOptions = {},
): PluginOptions {
  validateUserOptions(userPluginOptions);
  return {...DefaultPluginOptions, ...userPluginOptions};
}
