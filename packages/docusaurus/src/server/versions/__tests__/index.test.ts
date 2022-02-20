/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getPluginVersion} from '..';
import path from 'path';

describe('getPluginVersion', () => {
  it('Can detect external packages plugins versions of correctly.', async () => {
    await expect(
      getPluginVersion(
        path.join(__dirname, '..', '__fixtures__', 'dummy-plugin.js'),
        // Make the plugin appear external.
        path.join(__dirname, '..', '..', '..', '..', '..', '..', 'website'),
      ),
    ).resolves.toEqual({type: 'package', version: 'random-version'});
  });

  it('Can detect project plugins versions correctly.', async () => {
    await expect(
      getPluginVersion(
        path.join(__dirname, '..', '__fixtures__', 'dummy-plugin.js'),
        // Make the plugin appear project local.
        path.join(__dirname, '..', '__fixtures__'),
      ),
    ).resolves.toEqual({type: 'project'});
  });

  it('Can detect local packages versions correctly.', async () => {
    await expect(getPluginVersion('/', '/')).resolves.toEqual({type: 'local'});
  });
});
