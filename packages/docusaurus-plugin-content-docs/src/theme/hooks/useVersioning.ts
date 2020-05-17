/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

let versions: string[] = [];

try {
  versions = require('@site/versions.json');
} catch (e) {}

function useVersioning() {
  return {
    versioningEnabled: versions.length > 0,
    versions,
    latestVersion: versions[0],
  };
}

export default useVersioning;
