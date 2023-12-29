/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {askLanguage} from './prompts';
import type {SwizzleCLIOptions} from './common';

export type Languages = 'typescript' | 'javascript';

export async function getLanguage(
  options: SwizzleCLIOptions,
): Promise<Languages> {
  if (options.typescript) {
    return 'typescript';
  }
  if (options.javascript) {
    return 'javascript';
  }

  return askLanguage();
}
