/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Joi from '@hapi/joi';
import {RedirectMetadata} from './types';

export const PathnameValidator = Joi.string().pattern(/^\/\w*/);

const RedirectSchema = Joi.object<RedirectMetadata>({
  from: PathnameValidator.required(),
  to: PathnameValidator.required(),
});

export function validateRedirect(redirect: RedirectMetadata) {
  try {
    RedirectSchema.validate(redirect, {
      abortEarly: true,
    });
  } catch (e) {
    // Tells the user which redirect is the problem!
    throw new Error(
      `${JSON.stringify(redirect)} => Validation error: ${e.message}`,
    );
  }
}
