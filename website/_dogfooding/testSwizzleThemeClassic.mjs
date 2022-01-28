/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {fileURLToPath} from 'url';

// Unsafe imports
import {readComponentNames} from '@docusaurus/core/lib/commands/swizzle/components.js';
import {executeAction} from '@docusaurus/core/lib/commands/swizzle/actions.js';

const action = process.env.SWIZZLE_ACTION ?? 'eject';
console.log('action:', action);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const themePath = path.join(
  __dirname,
  '../../packages/docusaurus-theme-classic/lib-next/theme',
);

const toPath = path.join(__dirname, '_swizzle_theme_tests');

await fs.remove(toPath);

const componentNames = await readComponentNames(themePath);

for (const componentName of componentNames) {
  const result = await executeAction({
    action,
    siteDir: toPath,
    themePath,
    componentName,
  });
  console.log(
    `Swizzle of ${componentName} completed, ${result.createdFiles.length} files written`,
  );
}

console.log('END');
