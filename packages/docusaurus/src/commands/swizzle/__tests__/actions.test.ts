/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {ThemePath, Components, createTempSiteDir} from './testUtils';
import type {SwizzleAction} from '@docusaurus/types';

// @ts-expect-error: TODO no typedefs
import tree from 'tree-node-cli';
import {eject, wrap} from '../actions';

describe('eject', () => {
  async function testEject(action: SwizzleAction, componentName: string) {
    const siteDir = await createTempSiteDir();
    const siteThemePath = path.join(siteDir, 'src/theme');
    const result = await eject({
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

  test(`eject ${Components.FirstLevelComponent}`, async () => {
    const result = await testEject('eject', Components.FirstLevelComponent);
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
    const result = await testEject('eject', Components.ComponentInSubFolder);
    expect(result.createdFiles).toEqual([
      'ComponentInFolder/ComponentInSubFolder/index.css',
      'ComponentInFolder/ComponentInSubFolder/index.tsx',
      'ComponentInFolder/ComponentInSubFolder/styles.css',
      'ComponentInFolder/ComponentInSubFolder/styles.module.css',
    ]);
    expect(result.tree).toMatchInlineSnapshot(`
      "theme
      └── ComponentInFolder
          └── ComponentInSubFolder
              ├── index.css
              ├── index.tsx
              ├── styles.css
              └── styles.module.css"
    `);
  });

  test(`eject ${Components.ComponentInFolder}`, async () => {
    const result = await testEject('eject', Components.ComponentInFolder);
    expect(result.createdFiles).toEqual([
      // TODO do we really want to copy those Sibling components?
      // It's hard to filter those reliably (index.* is not good, we need to include styles.css too)
      'ComponentInFolder/Sibling.css',
      'ComponentInFolder/Sibling.js',
      'ComponentInFolder/index.css',
      'ComponentInFolder/index.tsx',
    ]);
    expect(result.tree).toMatchInlineSnapshot(`
      "theme
      └── ComponentInFolder
          ├── Sibling.css
          ├── Sibling.js
          ├── index.css
          └── index.tsx"
    `);
  });
});

describe('wrap', () => {
  async function testWrap(
    action: SwizzleAction,
    componentName: string,
    {typescript}: {typescript: boolean} = {typescript: false},
  ) {
    const siteDir = await createTempSiteDir();
    const siteThemePath = path.join(siteDir, 'src/theme');
    const result = await wrap({
      siteDir,
      componentName,
      themePath: ThemePath,
      typescript,
    });
    return {
      siteDir,
      siteThemePath,
      createdFiles: result.createdFiles.map((file) =>
        path.relative(siteThemePath, file),
      ),
      firstFileContent: () => fs.readFile(result.createdFiles[0], 'utf8'),
      tree: tree(siteThemePath),
    };
  }

  describe('JavaScript', () => {
    async function doWrap(componentName: string) {
      return testWrap('wrap', componentName, {
        typescript: false,
      });
    }

    test(`wrap ${Components.FirstLevelComponent}`, async () => {
      const result = await doWrap(Components.FirstLevelComponent);
      expect(result.createdFiles).toEqual(['FirstLevelComponent.js']);
      expect(result.tree).toMatchInlineSnapshot(`
              "theme
              └── FirstLevelComponent.js"
          `);
      await expect(result.firstFileContent()).resolves.toMatchInlineSnapshot(`
                          "
                          import React from 'react';
                          import FirstLevelComponent from '@theme-original/FirstLevelComponent';

                          export default function FirstLevelComponentWrapper(props) {
                            return (
                              <>
                                <FirstLevelComponent {...props} />
                              </>
                            );
                          }"
                      `);
    });

    test(`wrap ${Components.ComponentInSubFolder}`, async () => {
      const result = await doWrap(Components.ComponentInSubFolder);
      expect(result.createdFiles).toEqual([
        'ComponentInFolder/ComponentInSubFolder/index.js',
      ]);
      expect(result.tree).toMatchInlineSnapshot(`
              "theme
              └── ComponentInFolder
                  └── ComponentInSubFolder
                      └── index.js"
          `);
      await expect(result.firstFileContent()).resolves.toMatchInlineSnapshot(`
                          "
                          import React from 'react';
                          import ComponentInSubFolder from '@theme-original/ComponentInFolder/ComponentInSubFolder';

                          export default function ComponentInSubFolderWrapper(props) {
                            return (
                              <>
                                <ComponentInSubFolder {...props} />
                              </>
                            );
                          }"
                      `);
    });

    test(`wrap ${Components.ComponentInFolder}`, async () => {
      const result = await doWrap(Components.ComponentInFolder);
      expect(result.createdFiles).toEqual(['ComponentInFolder/index.js']);
      expect(result.tree).toMatchInlineSnapshot(`
              "theme
              └── ComponentInFolder
                  └── index.js"
          `);
      await expect(result.firstFileContent()).resolves.toMatchInlineSnapshot(`
                          "
                          import React from 'react';
                          import ComponentInFolder from '@theme-original/ComponentInFolder';

                          export default function ComponentInFolderWrapper(props) {
                            return (
                              <>
                                <ComponentInFolder {...props} />
                              </>
                            );
                          }"
                      `);
    });
  });

  describe('TypeScript', () => {
    async function doWrap(componentName: string) {
      return testWrap('wrap', componentName, {
        typescript: true,
      });
    }

    test(`wrap ${Components.FirstLevelComponent}`, async () => {
      const result = await doWrap(Components.FirstLevelComponent);
      expect(result.createdFiles).toEqual(['FirstLevelComponent.tsx']);
      expect(result.tree).toMatchInlineSnapshot(`
              "theme
              └── FirstLevelComponent.tsx"
          `);
      await expect(result.firstFileContent()).resolves.toMatchInlineSnapshot(`
              "
              import React, {ComponentProps} from 'react';
              import FirstLevelComponent from '@theme-original/FirstLevelComponent';

              type Props = ComponentProps<typeof FirstLevelComponent>

              export default function FirstLevelComponentWrapper(props: Props): JSX.Element {
                return (
                  <>
                    <FirstLevelComponentWrapper {...props} />
                  </>
                );
              }"
            `);
    });

    test(`wrap ${Components.ComponentInSubFolder}`, async () => {
      const result = await doWrap(Components.ComponentInSubFolder);
      expect(result.createdFiles).toEqual([
        'ComponentInFolder/ComponentInSubFolder/index.tsx',
      ]);
      expect(result.tree).toMatchInlineSnapshot(`
              "theme
              └── ComponentInFolder
                  └── ComponentInSubFolder
                      └── index.tsx"
          `);
      await expect(result.firstFileContent()).resolves.toMatchInlineSnapshot(`
              "
              import React, {ComponentProps} from 'react';
              import ComponentInSubFolder from '@theme-original/ComponentInFolder/ComponentInSubFolder';

              type Props = ComponentProps<typeof ComponentInSubFolder>

              export default function ComponentInSubFolderWrapper(props: Props): JSX.Element {
                return (
                  <>
                    <ComponentInSubFolderWrapper {...props} />
                  </>
                );
              }"
            `);
    });

    test(`wrap ${Components.ComponentInFolder}`, async () => {
      const result = await doWrap(Components.ComponentInFolder);
      expect(result.createdFiles).toEqual(['ComponentInFolder/index.tsx']);
      expect(result.tree).toMatchInlineSnapshot(`
              "theme
              └── ComponentInFolder
                  └── index.tsx"
          `);
      await expect(result.firstFileContent()).resolves.toMatchInlineSnapshot(`
              "
              import React, {ComponentProps} from 'react';
              import ComponentInFolder from '@theme-original/ComponentInFolder';

              type Props = ComponentProps<typeof ComponentInFolder>

              export default function ComponentInFolderWrapper(props: Props): JSX.Element {
                return (
                  <>
                    <ComponentInFolderWrapper {...props} />
                  </>
                );
              }"
            `);
    });
  });
});
