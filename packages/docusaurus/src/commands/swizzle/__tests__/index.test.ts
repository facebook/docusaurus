/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {ThemePath, createTempSiteDir} from './testUtils';
import tree from 'tree-node-cli';
// import swizzle from '../index';

async function createTestSiteConfig(siteDir: string) {
  const configPath = path.join(siteDir, 'docusaurus.config.js');
  const themeFileName = 'fixtureTheme.js';
  const themeFilePath = path.join(siteDir, themeFileName);

  await fs.writeFile(
    themeFilePath,
    `
module.exports = function fixtureTheme() {
      return {
        name: 'fixture-theme-name',
        getThemePath() {
          return '${ThemePath}';
        },
      };
      }
  `,
  );

  await fs.writeFile(
    configPath,
    `
module.exports = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  themes: ['./${themeFileName}'],
}`,
  );
}

async function createTestSite() {
  // const testDir = path.join(__dirname, '.tmp');
  // await fs.ensureDir(testDir);
  // const siteDir = await fs.mkdtemp(path.join(testDir, 'test-swizzle'));
  const siteDir = await createTempSiteDir();

  await createTestSiteConfig(siteDir);

  const siteThemePath = path.join(siteDir, 'src/theme');
  await fs.ensureDir(siteThemePath);

  return {
    siteDir,
    siteThemePath,
  };
}

describe('swizzle', () => {
  test(`swizzle wrap`, async () => {
    const {siteDir, siteThemePath} = await createTestSite();

    console.log({siteDir, siteThemePath});

    // TODO almost working apart Jest failing due to exit codes
    /*
    await swizzle(
      siteDir,
      'fixture-theme-name',
      Components.ComponentInSubFolder,
      {
        wrap: true,
        danger: true,
      },
    );
     */

    expect(tree(siteThemePath)).toMatchInlineSnapshot(`"theme"`);
  });
});
