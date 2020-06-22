/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {isValidPathname} from '@docusaurus/utils';
import * as Yup from 'yup';
import {RedirectMetadata} from './types';

export const PathnameValidator = Yup.string().test({
  name: 'isValidPathname',
  message:
    // Yup requires this format.
    // eslint-disable-next-line no-template-curly-in-string
    '${path} is not a valid pathname. Pathname should start with / and not contain any domain or query string',
  test: isValidPathname,
});

const RedirectSchema = Yup.object<RedirectMetadata>({
  from: PathnameValidator.required(),
  to: PathnameValidator.required(),
});

export function validateRedirect(redirect: RedirectMetadata): void {
  try {
    RedirectSchema.validateSync(redirect, {
      strict: true,
      abortEarly: true,
    });
  } catch (e) {
    // Tells the user which redirect is the problem!
    throw new Error(
      `${JSON.stringify(redirect)} => Validation error: ${e.message}`,
    );
  }
}
