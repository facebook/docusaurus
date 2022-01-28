/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {getThemeComponents, readComponentNames} from '../components';
import type {SwizzleConfig} from '@docusaurus/types';

const FixtureThemePath = path.join(__dirname, '__fixtures__/theme');

describe('readComponentNames', () => {
  test('read theme', () => {
    const themePath = FixtureThemePath;
    expect(readComponentNames(themePath)).toMatchInlineSnapshot(`
      Array [
        "ComponentInFolder/ComponentInSubFolder",
        "ComponentInFolder/Sibling",
        "ComponentInFolder",
        "FirstLevelComponent",
      ]
    `);
  });
});

describe('getThemeComponents', () => {
  const themeName = 'myThemeName';
  const themePath = FixtureThemePath;

  const swizzleConfig: SwizzleConfig = {
    components: {
      'ComponentInFolder/ComponentInSubFolder': {
        actions: {
          eject: 'safe',
          wrap: 'unsafe',
        },
      },
      ComponentInFolder: {
        actions: {
          wrap: 'safe',
        },
        description: 'ComponentInFolder description',
      },
    },
  };

  const themeComponents = getThemeComponents({
    themeName,
    themePath,
    swizzleConfig,
  });

  test('read name', () => {
    expect(themeComponents.themeName).toEqual(themeName);
  });

  test('read all', () => {
    // Order matters!
    expect(themeComponents.all).toMatchInlineSnapshot(`
      Array [
        "ComponentInFolder",
        "ComponentInFolder/ComponentInSubFolder",
        "ComponentInFolder/Sibling",
        "FirstLevelComponent",
      ]
    `);
  });

  test('getConfig', () => {
    expect(themeComponents.getConfig('ComponentInFolder'))
      .toMatchInlineSnapshot(`
      Object {
        "actions": Object {
          "wrap": "safe",
        },
        "description": "ComponentInFolder description",
      }
    `);
    expect(themeComponents.getConfig('ComponentInFolder/ComponentInSubFolder'))
      .toMatchInlineSnapshot(`
      Object {
        "actions": Object {
          "eject": "safe",
          "wrap": "unsafe",
        },
      }
    `);
    expect(themeComponents.getConfig('FirstLevelComponent'))
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

  test('getDescription', () => {
    expect(themeComponents.getDescription('ComponentInFolder')).toEqual(
      'ComponentInFolder description',
    );
    expect(
      themeComponents.getDescription('ComponentInFolder/ComponentInSubFolder'),
    ).toEqual('N/A');
    expect(themeComponents.getDescription('FirstLevelComponent')).toEqual(
      'N/A',
    );
  });

  test('getActionStatus', () => {
    expect(
      themeComponents.getActionStatus('ComponentInFolder', 'wrap'),
    ).toEqual('safe');
    expect(
      themeComponents.getActionStatus('ComponentInFolder', 'eject'),
    ).toEqual('unsafe');

    expect(
      themeComponents.getActionStatus(
        'ComponentInFolder/ComponentInSubFolder',
        'wrap',
      ),
    ).toEqual('unsafe');
    expect(
      themeComponents.getActionStatus(
        'ComponentInFolder/ComponentInSubFolder',
        'eject',
      ),
    ).toEqual('safe');

    expect(
      themeComponents.getActionStatus('FirstLevelComponent', 'wrap'),
    ).toEqual('unsafe');
    expect(
      themeComponents.getActionStatus('FirstLevelComponent', 'eject'),
    ).toEqual('unsafe');
  });

  test('isSafeAction', () => {
    expect(themeComponents.isSafeAction('ComponentInFolder', 'wrap')).toEqual(
      true,
    );
    expect(themeComponents.isSafeAction('ComponentInFolder', 'eject')).toEqual(
      false,
    );

    expect(
      themeComponents.isSafeAction(
        'ComponentInFolder/ComponentInSubFolder',
        'wrap',
      ),
    ).toEqual(false);
    expect(
      themeComponents.isSafeAction(
        'ComponentInFolder/ComponentInSubFolder',
        'eject',
      ),
    ).toEqual(true);

    expect(themeComponents.isSafeAction('FirstLevelComponent', 'wrap')).toEqual(
      false,
    );
    expect(
      themeComponents.isSafeAction('FirstLevelComponent', 'eject'),
    ).toEqual(false);
  });

  test('hasAnySafeAction', () => {
    expect(themeComponents.hasAnySafeAction('ComponentInFolder')).toEqual(true);
    expect(
      themeComponents.hasAnySafeAction(
        'ComponentInFolder/ComponentInSubFolder',
      ),
    ).toEqual(true);

    expect(themeComponents.hasAnySafeAction('FirstLevelComponent')).toEqual(
      false,
    );
  });
});
