/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {executeAction} from '../actions';
import {ThemePath, Components, createTempSiteDir} from './testUtils';
import type {SwizzleAction} from '@docusaurus/types';

// @ts-expect-error: TODO no typedefs
import tree from 'tree-node-cli';

async function testExecuteAction(action: SwizzleAction, componentName: string) {
  const siteDir = await createTempSiteDir();
  const siteThemePath = path.join(siteDir, 'src/theme');
  const result = await executeAction({
    action,
    siteDir,
    componentName,
    themePath: ThemePath,
  });
  const from = path.relative(ThemePath, result.from);
  const to = path.relative(siteThemePath, result.to);

  return {
    siteDir,
    siteThemePath,
    from,
    to,
    tree: tree(siteThemePath),
  };
}

describe('eject', () => {
  test(`eject ${Components.FirstLevelComponent}`, async () => {
    const result = await testExecuteAction(
      'eject',
      Components.FirstLevelComponent,
    );
    // TODO remove the .tsx extension from output + copy also css file
    expect(result.from).toEqual(`${Components.FirstLevelComponent  }.tsx`);
    expect(result.to).toEqual(`${Components.FirstLevelComponent  }.tsx`);
    expect(result.tree).toMatchInlineSnapshot(`
      "theme
      └── FirstLevelComponent.tsx"
    `);
  });

  test(`eject ${Components.ComponentInSubFolder}`, async () => {
    const result = await testExecuteAction(
      'eject',
      Components.ComponentInSubFolder,
    );

    expect(result.from).toEqual(Components.ComponentInSubFolder);
    expect(result.to).toEqual(Components.ComponentInSubFolder);
    expect(result.tree).toMatchInlineSnapshot(`
        "theme
        └── ComponentInFolder
            └── ComponentInSubFolder
                ├── index.css
                ├── index.stories.tsx
                ├── index.test.tsx
                └── index.tsx"
      `);
  });

  test(`eject ${Components.ComponentInFolder}`, async () => {
    const result = await testExecuteAction(
      'eject',
      Components.ComponentInFolder,
    );

    expect(result.from).toEqual(Components.ComponentInFolder);
    expect(result.to).toEqual(Components.ComponentInFolder);

    // TODO only copy index.{tsx,css} here
    expect(result.tree).toMatchInlineSnapshot(`
      "theme
      └── ComponentInFolder
          ├── ComponentInSubFolder
          │   ├── index.css
          │   ├── index.stories.tsx
          │   ├── index.test.tsx
          │   └── index.tsx
          ├── Sibling.css
          ├── Sibling.js
          ├── Sibling.stories.jsx
          ├── Sibling.test.js
          ├── __fixtures__
          │   └── FileInTest.ts
          ├── __tests__
          │   └── FileInFixtures.ts
          ├── index.css
          ├── index.stories.tsx
          ├── index.test.tsx
          └── index.tsx"
    `);
  });
});
