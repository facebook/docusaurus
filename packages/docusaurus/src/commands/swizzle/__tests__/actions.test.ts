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
  return {
    siteDir,
    siteThemePath,
    createdFiles: result.createdFiles.map((file) =>
      path.relative(siteThemePath, file),
    ),
    tree: tree(siteThemePath),
  };
}

describe('eject', () => {
  test(`eject ${Components.FirstLevelComponent}`, async () => {
    const result = await testExecuteAction(
      'eject',
      Components.FirstLevelComponent,
    );
    expect(result.createdFiles).toEqual([
      'FirstLevelComponent.css',
      'FirstLevelComponent.tsx',
    ]);
    expect(result.tree).toMatchInlineSnapshot(`
      "theme
      ├── FirstLevelComponent.css
      └── FirstLevelComponent.tsx"
    `);
  });

  test(`eject ${Components.ComponentInSubFolder}`, async () => {
    const result = await testExecuteAction(
      'eject',
      Components.ComponentInSubFolder,
    );
    expect(result.createdFiles).toEqual([
      'ComponentInFolder/ComponentInSubFolder/index.css',
      'ComponentInFolder/ComponentInSubFolder/index.tsx',
    ]);
    expect(result.tree).toMatchInlineSnapshot(`
      "theme
      └── ComponentInFolder
          └── ComponentInSubFolder
              ├── index.css
              └── index.tsx"
    `);
  });

  test(`eject ${Components.ComponentInFolder}`, async () => {
    const result = await testExecuteAction(
      'eject',
      Components.ComponentInFolder,
    );
    expect(result.createdFiles).toEqual([
      'ComponentInFolder/index.css',
      'ComponentInFolder/index.tsx',
    ]);
    expect(result.tree).toMatchInlineSnapshot(`
      "theme
      └── ComponentInFolder
          ├── index.css
          └── index.tsx"
    `);
  });
});
