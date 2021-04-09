/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { buildUrl } from '../buildRemoteBranchUrl'

describe('remoteeBranchUrl', () => {
  test('should build a normal ssh url', async () => {
    const url = buildUrl("github.com", undefined, undefined, "org", "prj", true)
    expect(url).toEqual("git@github.com:org/prj.git");
  });
  test('should build a ssh url with port', async () => {
    const url = buildUrl("github.com", "422", undefined, "org", "prj", true)
    expect(url).toEqual("ssh://git@github.com:422/org/prj.git");
  });
  test('should build a normal http url', async () => {
    const url = buildUrl("github.com", undefined, "user:pass", "org", "prj", false);
    expect(url).toEqual("https://user:pass@github.com/org/prj.git");
  });
  test('should build a normal http url', async () => {
    const url = buildUrl("github.com", "5433", "user:pass", "org", "prj", false);
    expect(url).toEqual("https://user:pass@github.com:5433/org/prj.git");
  });
});
