/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {getThemeComponents, readComponentNames} from '../components';
import type {SwizzleConfig} from '@docusaurus/types';
import {Components} from './testUtils';

const FixtureThemePath = path.join(__dirname, '__fixtures__/theme');

describe('readComponentNames', () => {
  it('read theme', async () => {
    await expect(readComponentNames(FixtureThemePath)).resolves.toEqual([
      Components.ComponentInFolder,
      Components.ComponentInSubFolder,
      Components.Sibling,
      Components.FirstLevelComponent,
    ]);
  });
});

describe('getThemeComponents', () => {
  const themeName = 'myThemeName';
  const themePath = FixtureThemePath;

  const swizzleConfig: SwizzleConfig = {
    components: {
      [Components.ComponentInSubFolder]: {
        actions: {
          eject: 'safe',
          wrap: 'unsafe',
        },
      },
      [Components.ComponentInFolder]: {
        actions: {
          wrap: 'safe',
          eject: 'unsafe',
        },
        description: 'ComponentInFolder description',
      },
    },
  };

  it('read name', async () => {
    const themeComponents = await getThemeComponents({
      themeName,
      themePath,
      swizzleConfig,
    });
    expect(themeComponents.themeName).toEqual(themeName);
  });

  it('read all', async () => {
    const themeComponents = await getThemeComponents({
      themeName,
      themePath,
      swizzleConfig,
    });
    expect(themeComponents.all).toEqual([
      // Order matters!
      Components.ComponentInFolder,
      Components.ComponentInSubFolder,
      Components.Sibling,
      Components.FirstLevelComponent,
    ]);
  });

  it('getConfig', async () => {
    const themeComponents = await getThemeComponents({
      themeName,
      themePath,
      swizzleConfig,
    });
    expect(themeComponents.getConfig(Components.ComponentInFolder))
      .toMatchInlineSnapshot(`
      Object {
        "actions": Object {
          "eject": "unsafe",
          "wrap": "safe",
        },
        "description": "ComponentInFolder description",
      }
    `);
    expect(themeComponents.getConfig(Components.ComponentInSubFolder))
      .toMatchInlineSnapshot(`
      Object {
        "actions": Object {
          "eject": "safe",
          "wrap": "unsafe",
        },
      }
    `);
    expect(themeComponents.getConfig(Components.FirstLevelComponent))
      .toMatchInlineSnapshot(`
      Object {
        "actions": Object {
          "eject": "unsafe",
          "wrap": "unsafe",
        },
        "description": "N/A",
      }
    `);

    expect(() =>
      themeComponents.getConfig('DoesNotExistComp'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Can't get component config: component doesn't exist: DoesNotExistComp"`,
    );
  });

  it('getDescription', async () => {
    const themeComponents = await getThemeComponents({
      themeName,
      themePath,
      swizzleConfig,
    });
    expect(
      themeComponents.getDescription(Components.ComponentInFolder),
    ).toEqual('ComponentInFolder description');
    expect(
      themeComponents.getDescription(Components.ComponentInSubFolder),
    ).toEqual('N/A');
    expect(
      themeComponents.getDescription(Components.FirstLevelComponent),
    ).toEqual('N/A');
  });

  it('getActionStatus', async () => {
    const themeComponents = await getThemeComponents({
      themeName,
      themePath,
      swizzleConfig,
    });
    expect(
      themeComponents.getActionStatus(Components.ComponentInFolder, 'wrap'),
    ).toEqual('safe');
    expect(
      themeComponents.getActionStatus(Components.ComponentInFolder, 'eject'),
    ).toEqual('unsafe');

    expect(
      themeComponents.getActionStatus(Components.ComponentInSubFolder, 'wrap'),
    ).toEqual('unsafe');
    expect(
      themeComponents.getActionStatus(Components.ComponentInSubFolder, 'eject'),
    ).toEqual('safe');

    expect(
      themeComponents.getActionStatus(Components.FirstLevelComponent, 'wrap'),
    ).toEqual('unsafe');
    expect(
      themeComponents.getActionStatus(Components.FirstLevelComponent, 'eject'),
    ).toEqual('unsafe');
  });

  it('isSafeAction', async () => {
    const themeComponents = await getThemeComponents({
      themeName,
      themePath,
      swizzleConfig,
    });
    expect(
      themeComponents.isSafeAction(Components.ComponentInFolder, 'wrap'),
    ).toEqual(true);
    expect(
      themeComponents.isSafeAction(Components.ComponentInFolder, 'eject'),
    ).toEqual(false);

    expect(
      themeComponents.isSafeAction(Components.ComponentInSubFolder, 'wrap'),
    ).toEqual(false);
    expect(
      themeComponents.isSafeAction(Components.ComponentInSubFolder, 'eject'),
    ).toEqual(true);

    expect(
      themeComponents.isSafeAction(Components.FirstLevelComponent, 'wrap'),
    ).toEqual(false);
    expect(
      themeComponents.isSafeAction(Components.FirstLevelComponent, 'eject'),
    ).toEqual(false);
  });

  it('hasAnySafeAction', async () => {
    const themeComponents = await getThemeComponents({
      themeName,
      themePath,
      swizzleConfig,
    });
    expect(
      themeComponents.hasAnySafeAction(Components.ComponentInFolder),
    ).toEqual(true);
    expect(
      themeComponents.hasAnySafeAction(Components.ComponentInSubFolder),
    ).toEqual(true);
    expect(
      themeComponents.hasAnySafeAction(Components.FirstLevelComponent),
    ).toEqual(false);
  });
});
