/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import jiti from 'jiti';
import logger from '@docusaurus/logger';

/*
jiti is able to load ESM, CJS, JSON, TS modules
 */
export async function loadFreshModule(modulePath: string): Promise<unknown> {
  try {
    const load = jiti(__filename, {
      cache: true, // Transpilation cache, can be safely enabled
      requireCache: false, // Bypass Node.js runtime require cache
      interopDefault: true,
      // debug: true,
    });

    return load(modulePath);
  } catch (error) {
    throw new Error(
      logger.interpolate`Docusaurus could not load module at path=${modulePath}: ${
        (error as Error).message
      }}`,
      {cause: error},
    );
  }
}
