/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import loadConfig from '../config';

describe('loadConfig', () => {
  test('website with valid siteConfig', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'simple-site',
      'docusaurus.config.js',
    );
    const config = await loadConfig(siteDir);
    expect(config).toMatchSnapshot();
    expect(config).not.toEqual({});
  });

  test('website with valid config creator function', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'configs',
      'createConfig.config.js',
    );
    const config = await loadConfig(siteDir);
    expect(config).toMatchSnapshot();
    expect(config).not.toEqual({});
  });

  test('website with valid async config', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'configs',
      'configAsync.config.js',
    );
    const config = await loadConfig(siteDir);
    expect(config).toMatchSnapshot();
    expect(config).not.toEqual({});
  });

  test('website with valid async config creator function', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'configs',
      'createConfigAsync.config.js',
    );
    const config = await loadConfig(siteDir);
    expect(config).toMatchSnapshot();
    expect(config).not.toEqual({});
  });

  test('website with incomplete siteConfig', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'bad-site',
      'docusaurus.config.js',
    );
    await expect(loadConfig(siteDir)).rejects.toThrowErrorMatchingSnapshot();
  });

  test('website with useless field (wrong field) in siteConfig', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'wrong-site',
      'docusaurus.config.js',
    );
    await expect(loadConfig(siteDir)).rejects.toThrowErrorMatchingSnapshot();
  });

  test('website with no siteConfig', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'nonExisting',
      'docusaurus.config.js',
    );
    await expect(loadConfig(siteDir)).rejects.toThrowError(
      /Config file at ".*?__fixtures__[/\\]nonExisting[/\\]docusaurus.config.js" not found.$/,
    );
  });
});
