/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {RedirectMetadata} from './types';
import {Joi, PathnameSchema} from '@docusaurus/utils-validation';

const RedirectSchema = Joi.object<RedirectMetadata>({
  from: PathnameSchema.required(),
  to: PathnameSchema.required(),
});

export function validateRedirect(redirect: RedirectMetadata): void {
  const {error} = RedirectSchema.validate(redirect, {
    abortEarly: true,
    convert: false,
  });

  if (error) {
    // Tells the user which redirect is the problem!
    throw new Error(
      `${JSON.stringify(redirect)} => Validation error: ${error.message}`,
    );
  }
}
