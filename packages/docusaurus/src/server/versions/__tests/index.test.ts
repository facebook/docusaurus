/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getPluginVersion} from '..';
import path from 'path';

describe('getPluginVersion', () => {
  it('Can detect external packages plugins versions of correctly.', () => {
    expect(
      getPluginVersion(
        path.join(__dirname, '..', '__fixtures__', 'dummy-plugin.js'),
        // Make the plugin appear external.
        path.join(__dirname, '..', '..', '..', '..', '..', '..', 'website'),
      ),
    ).toEqual({type: 'package', version: 'random-version'});
  });

  it('Can detect project plugins versions correctly.', () => {
    expect(
      getPluginVersion(
        path.join(__dirname, '..', '__fixtures__', 'dummy-plugin.js'),
        // Make the plugin appear project local.
        path.join(__dirname, '..', '__fixtures__'),
      ),
    ).toEqual({type: 'project'});
  });

  it('Can detect local packages versions correctly.', () => {
    expect(getPluginVersion('/', '/')).toEqual({type: 'local'});
  });
});
