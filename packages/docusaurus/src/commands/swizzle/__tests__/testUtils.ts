/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import os from 'os';
import fs from 'fs-extra';

export const ThemePath = path.join(__dirname, '__fixtures__/theme');

export const Components = {
  ComponentInSubFolder: 'ComponentInFolder/ComponentInSubFolder',
  Sibling: 'ComponentInFolder/Sibling',
  ComponentInFolder: 'ComponentInFolder',
  FirstLevelComponent: 'FirstLevelComponent',
};

export async function createTempSiteDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'docusaurus-test-swizzle-siteDir'));
}
