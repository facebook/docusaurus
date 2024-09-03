/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi, PathnameSchema} from '@docusaurus/utils-validation';
import type {RedirectItem} from './types';

const RedirectSchema = Joi.object<RedirectItem>({
  from: PathnameSchema.required(),
  to: Joi.string().required(),
});

export function validateRedirect(redirect: RedirectItem): void {
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
