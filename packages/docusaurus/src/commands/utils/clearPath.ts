/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {PerfLogger} from '@docusaurus/logger';

/**
 * @param pathToClear
 */
export default async function clearPath(pathToClear: string): Promise<void> {
  return PerfLogger.async(
    `clearPath ${path.relative(process.cwd(), pathToClear)}`,
    async () => {
      if (!(await fs.pathExists(pathToClear))) {
        return;
      }
      await fs.remove(pathToClear);
    },
  );
}
