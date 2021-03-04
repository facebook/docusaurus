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
    const config = loadConfig(siteDir);
    expect(config).toMatchSnapshot();
    expect(config).not.toEqual({});
  });

  test('website with incomplete siteConfig', () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'bad-site',
      'docusaurus.config.js',
    );
    expect(() => {
      loadConfig(siteDir);
    }).toThrowErrorMatchingSnapshot();
  });

  test('website with useless field (wrong field) in siteConfig', () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'wrong-site',
      'docusaurus.config.js',
    );
    expect(() => {
      loadConfig(siteDir);
    }).toThrowErrorMatchingSnapshot();
  });

  test('website with no siteConfig', () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'nonExisting',
      'docusaurus.config.js',
    );
    expect(() => {
      loadConfig(siteDir);
    }).toThrowError(
      /Config file "(.*?)__fixtures__[/\\]nonExisting[/\\]docusaurus.config.js" not found$/,
    );
  });
});
