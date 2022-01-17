/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {buildSshUrl, buildHttpsUrl, hasSSHProtocol} from '../deploy';

describe('remoteBranchUrl', () => {
  test('should build a normal ssh url', () => {
    const url = buildSshUrl('github.com', 'facebook', 'docusaurus');
    expect(url).toEqual('git@github.com:facebook/docusaurus.git');
  });
  test('should build a ssh url with port', () => {
    const url = buildSshUrl('github.com', 'facebook', 'docusaurus', '422');
    expect(url).toEqual('ssh://git@github.com:422/facebook/docusaurus.git');
  });
  test('should build a normal http url', () => {
    const url = buildHttpsUrl(
      'user:pass',
      'github.com',
      'facebook',
      'docusaurus',
    );
    expect(url).toEqual('https://user:pass@github.com/facebook/docusaurus.git');
  });
  test('should build a normal http url with port', () => {
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

describe('hasSSHProtocol', () => {
  test('should recognize explicit SSH protocol', () => {
    const url = 'ssh://git@github.com:422/facebook/docusaurus.git';
    expect(hasSSHProtocol(url)).toEqual(true);
  });

  test('should recognize implied SSH protocol', () => {
    const url = 'git@github.com:facebook/docusaurus.git';
    expect(hasSSHProtocol(url)).toEqual(true);
  });

  test('should not recognize HTTPS with credentials', () => {
    const url = 'https://user:pass@github.com/facebook/docusaurus.git';
    expect(hasSSHProtocol(url)).toEqual(false);
  });

  test('should not recognize plain HTTPS URL', () => {
    const url = 'https://github.com:5433/facebook/docusaurus.git';
    expect(hasSSHProtocol(url)).toEqual(false);
  });
});
