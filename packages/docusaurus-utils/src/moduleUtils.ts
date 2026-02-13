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
  if (typeof modulePath !== 'string') {
    throw new Error(
      logger.interpolate`Invalid module path of type "name=${typeof modulePath}" with value "name=${modulePath}"`,
    );
  }
  try {
    const load = jiti(__filename, {
      // Transpilation cache, can be safely enabled
      cache: true,
      // Bypass Node.js runtime require cache
      // Same as "import-fresh" package we used previously
      requireCache: false,
      // Only take into consideration the default export
      // For now we don't need named exports
      // This also helps normalize return value for both CJS/ESM/TS modules
      interopDefault: true,
      // debug: true,
    });

    return load(modulePath);
  } catch (error) {
    throw new Error(
      logger.interpolate`Docusaurus could not load module at path path=${modulePath}`,
      {cause: error},
    );
  }
}
