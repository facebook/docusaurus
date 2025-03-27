/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {rm} from 'fs/promises';
import {PerfLogger} from '@docusaurus/logger';

/**
 * @param pathToClear
 */
export default async function clearPath(pathToClear: string): Promise<void> {
  return PerfLogger.async(
    `clearPath ${path.relative(process.cwd(), pathToClear)}`,
    async () => {
      await rm(pathToClear, {recursive: true, force: true});
    },
  );
}
