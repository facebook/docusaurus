/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createHash} from 'crypto';
import {kebabCase} from 'lodash';
import {shortName, isNameTooLong} from './pathUtils';

export function md5Hash(str: string): string {
  return createHash('md5').update(str).digest('hex');
}

export function simpleHash(str: string, length: number): string {
  return md5Hash(str).substr(0, length);
}

// Based on https://github.com/gatsbyjs/gatsby/pull/21518/files
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
