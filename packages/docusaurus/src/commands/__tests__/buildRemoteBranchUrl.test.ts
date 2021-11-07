/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {buildSshUrl, buildHttpsUrl} from '../buildRemoteBranchUrl';

describe('remoteeBranchUrl', () => {
  test('should build a normal ssh url', async () => {
    const url = buildSshUrl('github.com', 'facebook', 'docusaurus');
    expect(url).toEqual('git@github.com:facebook/docusaurus.git');
  });
  test('should build a ssh url with port', async () => {
    const url = buildSshUrl('github.com', 'facebook', 'docusaurus', '422');
    expect(url).toEqual('ssh://git@github.com:422/facebook/docusaurus.git');
  });
  test('should build a normal http url', async () => {
    const url = buildHttpsUrl(
      'user:pass',
      'github.com',
      'facebook',
      'docusaurus',
    );
    expect(url).toEqual('https://user:pass@github.com/facebook/docusaurus.git');
  });
  test('should build a normal http url', async () => {
    const url = buildHttpsUrl(
      'user:pass',
      'github.com',
      'facebook',
      'docusaurus',
      '5433',
    );
    expect(url).toEqual(
      'https://user:pass@github.com:5433/facebook/docusaurus.git',
    );
  });
});
