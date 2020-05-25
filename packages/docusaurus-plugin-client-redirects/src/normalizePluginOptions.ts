/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptions, RedirectsCreator, UserPluginOptions} from './types';
import * as Yup from 'yup';

export const DefaultPluginOptions: PluginOptions = {
  fromExtensions: [],
  toExtensions: [],
};

function isRedirectsCreator(value: any): value is RedirectsCreator | undefined {
  if (value === null || typeof value === 'undefined') {
    return true;
  }
  return value instanceof Function;
}

const UserOptionsSchema = Yup.object().shape<UserPluginOptions>({
  fromExtensions: Yup.array().of(Yup.string().required().min(0)),
  toExtensions: Yup.array().of(Yup.string().required().min(0)),
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
