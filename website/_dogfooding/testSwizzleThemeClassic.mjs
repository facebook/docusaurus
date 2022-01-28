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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const themePath = path.join(
  __dirname,
  '../../packages/docusaurus-theme-classic/lib-next/theme',
);

const toPath = path.join(__dirname, '_swizzle_theme_tests');

await fs.remove(toPath);

let componentNames = await readComponentNames(themePath);

// TODO temp workaround: non-comps should be forbidden to wrap
if (action === 'wrap') {
  const blacklist = [
    'NavbarItem',
    'NavbarItem/utils',
    'Layout',
    'prism-include-languages',
  ];

  componentNames = componentNames.filter((name) => !blacklist.includes(name));
}

for (const componentName of componentNames) {
  const result = await executeAction({
    action,
    siteDir: toPath,
    themePath,
    componentName,
    importType: 'init', // For these tests, "theme-original" imports are causing an expected infinite loop
  });

  console.log(
    `${action} ${componentName} => ${result.createdFiles.length} file${
      result.createdFiles.length > 1 ? 's' : ''
    } written`,
  );
}

console.log('END');
