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
import {wrap, eject} from '@docusaurus/core/lib/commands/swizzle/actions.js';

const action = process.env.SWIZZLE_ACTION ?? 'eject';
const typescript = process.env.SWIZZLE_TYPESCRIPT === 'true';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const classicThemePathBase = path.join(
  dirname,
  '../../packages/docusaurus-theme-classic',
);

const themePath = typescript
  ? path.join(classicThemePathBase, 'src/theme')
  : path.join(classicThemePathBase, 'lib-next/theme');

const toPath = path.join(dirname, '_swizzle_theme_tests');

console.log('Args', {action, typescript, dirname, themePath, toPath});

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
  const baseParams = {
    action,
    siteDir: toPath,
    themePath,
    componentName,
  };

  const executeAction = () => {
    switch (action) {
      case 'wrap':
        return wrap({
          ...baseParams,
          importType: 'init', // For these tests, "theme-original" imports are causing an expected infinite loop
          typescript,
        });
      case 'eject':
        return eject(baseParams);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  };

  const result = await executeAction();

  console.log(
    `${action} ${componentName} => ${result.createdFiles.length} file${
      result.createdFiles.length > 1 ? 's' : ''
    } written`,
  );
}

console.log('END');
