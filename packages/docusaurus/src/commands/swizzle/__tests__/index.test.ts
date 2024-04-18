/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import tree from 'tree-node-cli';
import {escapePath, Globby, posixPath} from '@docusaurus/utils';
import {ThemePath, createTempSiteDir, Components} from './testUtils';
import {swizzle} from '../index';

const FixtureThemeName = 'fixture-theme-name';

// TODO is it really worth it to duplicate fixtures?
const ThemePathJS = ThemePath;
const ThemePathTS = ThemePath;

async function createTestSiteConfig(siteDir: string) {
  const configPath = path.join(siteDir, 'docusaurus.config.js');

  await fs.writeFile(
    configPath,
    `
module.exports = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',
  themes: [
    function fixtureTheme() {
      return {
        name: '${FixtureThemeName}',
        getThemePath() {
          return '${escapePath(ThemePathJS)}';
        },
        getTypeScriptThemePath() {
          return '${escapePath(ThemePathTS)}';
        },
      };
    },
  ],
}`,
  );
}

class MockExitError extends Error {
  constructor(public code: number) {
    super(`Exit with code ${code}`);
    this.code = code;
  }
}

function createExitMock() {
  let mock: jest.SpyInstance<(code?: number) => never>;

  // eslint-disable-next-line jest/require-top-level-describe
  beforeEach(async () => {
    mock = jest.spyOn(process, 'exit').mockImplementation((code) => {
      throw new MockExitError(code!);
    }) as jest.SpyInstance<(code?: number) => never>;
  });
  // eslint-disable-next-line jest/require-top-level-describe
  afterEach(async () => {
    mock.mockRestore();
  });

  return {
    expectExitCode: (code: number) => {
      expect(mock).toHaveBeenCalledWith(code);
    },
  };
}

const swizzleWithExit: typeof swizzle = async (...args) => {
  await expect(() => swizzle(...args)).rejects.toThrow(MockExitError);
};

async function createTestSite() {
  const siteDir = await createTempSiteDir();

  await createTestSiteConfig(siteDir);

  const siteThemePath = path.join(siteDir, 'src/theme');
  await fs.ensureDir(siteThemePath);

  async function snapshotThemeDir() {
    const siteThemePathPosix = posixPath(siteThemePath);
    expect(tree(siteThemePathPosix)).toMatchSnapshot('theme dir tree');

    const files = (await Globby(siteThemePathPosix))
      .map((file) => path.posix.relative(siteThemePathPosix, file))
      .sort();

    for (const file of files) {
      const fileContent = await fs.readFile(
        path.posix.join(siteThemePath, file),
        'utf-8',
      );
      expect(fileContent).toMatchSnapshot(file);
    }
  }

  function testWrap({
    component,
    typescript,
  }: {
    component: string;
    typescript?: boolean;
  }) {
    return swizzleWithExit(FixtureThemeName, component, siteDir, {
      wrap: true,
      danger: true,
      typescript,
      javascript: !typescript,
    });
  }

  function testEject({
    component,
    typescript,
  }: {
    component: string;
    typescript?: boolean;
  }) {
    return swizzleWithExit(FixtureThemeName, component, siteDir, {
      eject: true,
      danger: true,
      typescript,
      javascript: !typescript,
    });
  }

  return {
    siteDir,
    siteThemePath,
    snapshotThemeDir,
    testWrap,
    testEject,
  };
}

describe('swizzle wrap', () => {
  const exitMock = createExitMock();

  it(`${Components.FirstLevelComponent} JS`, async () => {
    const {snapshotThemeDir, testWrap} = await createTestSite();
    await testWrap({
      component: Components.FirstLevelComponent,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });

  it(`${Components.FirstLevelComponent} TS`, async () => {
    const {snapshotThemeDir, testWrap} = await createTestSite();
    await testWrap({
      component: Components.FirstLevelComponent,
      typescript: true,
    });
    await snapshotThemeDir();
  });

  it(`${Components.ComponentInFolder} JS`, async () => {
    const {snapshotThemeDir, testWrap} = await createTestSite();
    await testWrap({
      component: Components.ComponentInFolder,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });

  it(`${Components.ComponentInFolder} TS`, async () => {
    const {snapshotThemeDir, testWrap} = await createTestSite();
    await testWrap({
      component: Components.ComponentInFolder,
      typescript: true,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });

  it(`${Components.ComponentInSubFolder} JS`, async () => {
    const {snapshotThemeDir, testWrap} = await createTestSite();
    await testWrap({
      component: Components.ComponentInSubFolder,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });

  it(`${Components.ComponentInSubFolder} TS`, async () => {
    const {snapshotThemeDir, testWrap} = await createTestSite();
    await testWrap({
      component: Components.ComponentInSubFolder,
      typescript: true,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });

  it(`${Components.Sibling} JS`, async () => {
    const {snapshotThemeDir, testWrap} = await createTestSite();
    await testWrap({
      component: Components.Sibling,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });

  it(`${Components.Sibling} TS`, async () => {
    const {snapshotThemeDir, testWrap} = await createTestSite();
    await testWrap({
      component: Components.Sibling,
      typescript: true,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });
});

describe('swizzle eject', () => {
  const exitMock = createExitMock();

  it(`${Components.FirstLevelComponent} JS`, async () => {
    const {snapshotThemeDir, testEject} = await createTestSite();
    await testEject({
      component: Components.FirstLevelComponent,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });

  it(`${Components.FirstLevelComponent} TS`, async () => {
    const {snapshotThemeDir, testEject} = await createTestSite();
    await testEject({
      component: Components.FirstLevelComponent,
      typescript: true,
    });
    await snapshotThemeDir();
  });

  it(`${Components.ComponentInFolder} JS`, async () => {
    const {snapshotThemeDir, testEject} = await createTestSite();
    await testEject({
      component: Components.ComponentInFolder,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });

  it(`${Components.ComponentInFolder} TS`, async () => {
    const {snapshotThemeDir, testEject} = await createTestSite();
    await testEject({
      component: Components.ComponentInFolder,
      typescript: true,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });

  it(`${Components.ComponentInSubFolder} JS`, async () => {
    const {snapshotThemeDir, testEject} = await createTestSite();
    await testEject({
      component: Components.ComponentInSubFolder,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });

  it(`${Components.ComponentInSubFolder} TS`, async () => {
    const {snapshotThemeDir, testEject} = await createTestSite();
    await testEject({
      component: Components.ComponentInSubFolder,
      typescript: true,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });

  it(`${Components.Sibling} JS`, async () => {
    const {snapshotThemeDir, testEject} = await createTestSite();
    await testEject({
      component: Components.Sibling,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });

  it(`${Components.Sibling} TS`, async () => {
    const {snapshotThemeDir, testEject} = await createTestSite();
    await testEject({
      component: Components.Sibling,
      typescript: true,
    });
    exitMock.expectExitCode(0);
    await snapshotThemeDir();
  });
});
