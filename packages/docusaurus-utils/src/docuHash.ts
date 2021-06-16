/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {kebabCase} from 'lodash';

import {shortName, isNameTooLong, simpleHash} from './pathUtils';

/**
 * Given an input string, convert to kebab-case and append a hash.
 * Avoid str collision.
 * Also removes part of the string if its larger than the allowed
 * filename per OS. Avoids ERRNAMETOOLONG error.
 */
export function docuHash(str: string): string {
  if (str === '/') {
    return 'index';
  }
  const shortHash = simpleHash(str, 3);
  const parsedPath = `${kebabCase(str)}-${shortHash}`;
  if (isNameTooLong(parsedPath)) {
    return `${shortName(kebabCase(str))}-${shortHash}`;
  }
  return parsedPath;
}
