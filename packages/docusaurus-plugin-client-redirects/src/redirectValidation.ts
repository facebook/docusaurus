/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Joi from '@hapi/joi';
import {isValidPathname} from '@docusaurus/utils';
import {RedirectMetadata} from './types';

export const PathnameValidator = Joi.string()
  .custom((val) => {
    if (!isValidPathname(val)) throw new Error();
    else return val;
  })
  .message(
    '{{#label}} is not a valid pathname. Pathname should start with / and not contain any domain or query string',
  );

const RedirectSchema = Joi.object<RedirectMetadata>({
  from: PathnameValidator.required(),
  to: PathnameValidator.required(),
});

export function validateRedirect(redirect: RedirectMetadata) {
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
