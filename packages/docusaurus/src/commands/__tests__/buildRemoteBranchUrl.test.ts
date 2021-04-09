/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {buildUrl} from '../buildRemoteBranchUrl';

describe('remoteeBranchUrl', () => {
  test('should build a normal ssh url', async () => {
    const url = buildUrl(
      'github.com',
      undefined,
      undefined,
      'facebook',
      'docusaurus',
      true,
    );
    expect(url).toEqual('git@github.com:facebook/docusaurus.git');
  });
  test('should build a ssh url with port', async () => {
    const url = buildUrl(
      'github.com',
      '422',
      undefined,
      'facebook',
      'docusaurus',
      true,
    );
    expect(url).toEqual('ssh://git@github.com:422/facebook/docusaurus.git');
  });
  test('should build a normal http url', async () => {
    const url = buildUrl(
      'github.com',
      undefined,
      'user:pass',
      'facebook',
      'docusaurus',
      false,
    );
    expect(url).toEqual('https://user:pass@github.com/facebook/docusaurus.git');
  });
  test('should build a normal http url', async () => {
    const url = buildUrl(
      'github.com',
      '5433',
      'user:pass',
      'facebook',
      'docusaurus',
      false,
    );
    expect(url).toEqual(
      'https://user:pass@github.com:5433/facebook/docusaurus.git',
    );
  });
});
