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

describe('executeAction', () => {
  async function testExecuteAction(
    action: SwizzleAction,
    componentName: string,
  ) {
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
    test('eject FirstLevelComponent', async () => {
      const result = await testExecuteAction(
        'eject',
        Components.FirstLevelComponent,
      );
      expect(result.from).toEqual('FirstLevelComponent.tsx');
      expect(result.to).toEqual('FirstLevelComponent.tsx');
    });

    test('eject ComponentInSubFolder', async () => {
      const result = await testExecuteAction(
        'eject',
        Components.ComponentInSubFolder,
      );

      expect(result.from).toEqual('ComponentInFolder/ComponentInSubFolder');
      expect(result.to).toEqual('ComponentInFolder/ComponentInSubFolder');
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
  });
});
