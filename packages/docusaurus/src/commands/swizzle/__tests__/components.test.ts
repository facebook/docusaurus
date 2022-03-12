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
    expect(themeComponents.getDescription(Components.ComponentInFolder)).toBe(
      'ComponentInFolder description',
    );
    expect(
      themeComponents.getDescription(Components.ComponentInSubFolder),
    ).toBe('N/A');
    expect(themeComponents.getDescription(Components.FirstLevelComponent)).toBe(
      'N/A',
    );
  });

  it('getActionStatus', async () => {
    const themeComponents = await getThemeComponents({
      themeName,
      themePath,
      swizzleConfig,
    });
    expect(
      themeComponents.getActionStatus(Components.ComponentInFolder, 'wrap'),
    ).toBe('safe');
    expect(
      themeComponents.getActionStatus(Components.ComponentInFolder, 'eject'),
    ).toBe('unsafe');

    expect(
      themeComponents.getActionStatus(Components.ComponentInSubFolder, 'wrap'),
    ).toBe('unsafe');
    expect(
      themeComponents.getActionStatus(Components.ComponentInSubFolder, 'eject'),
    ).toBe('safe');

    expect(
      themeComponents.getActionStatus(Components.FirstLevelComponent, 'wrap'),
    ).toBe('unsafe');
    expect(
      themeComponents.getActionStatus(Components.FirstLevelComponent, 'eject'),
    ).toBe('unsafe');
  });

  it('isSafeAction', async () => {
    const themeComponents = await getThemeComponents({
      themeName,
      themePath,
      swizzleConfig,
    });
    expect(
      themeComponents.isSafeAction(Components.ComponentInFolder, 'wrap'),
    ).toBe(true);
    expect(
      themeComponents.isSafeAction(Components.ComponentInFolder, 'eject'),
    ).toBe(false);

    expect(
      themeComponents.isSafeAction(Components.ComponentInSubFolder, 'wrap'),
    ).toBe(false);
    expect(
      themeComponents.isSafeAction(Components.ComponentInSubFolder, 'eject'),
    ).toBe(true);

    expect(
      themeComponents.isSafeAction(Components.FirstLevelComponent, 'wrap'),
    ).toBe(false);
    expect(
      themeComponents.isSafeAction(Components.FirstLevelComponent, 'eject'),
    ).toBe(false);
  });

  it('hasAnySafeAction', async () => {
    const themeComponents = await getThemeComponents({
      themeName,
      themePath,
      swizzleConfig,
    });
    expect(themeComponents.hasAnySafeAction(Components.ComponentInFolder)).toBe(
      true,
    );
    expect(
      themeComponents.hasAnySafeAction(Components.ComponentInSubFolder),
    ).toBe(true);
    expect(
      themeComponents.hasAnySafeAction(Components.FirstLevelComponent),
    ).toBe(false);
  });
});
