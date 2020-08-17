/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

let versions: string[];

try {
  // eslint-disable-next-line global-require
  versions = require('@site/versions.json');
} catch {
  versions = [];
}

// TODO deprecate in favor of useDocs.ts instead
function useVersioning(): {
  versioningEnabled: boolean;
  versions: string[];
  latestVersion: string;
} {
  return {
    versioningEnabled: versions.length > 0,
    versions,
    latestVersion: versions[0],
  };
}

export default useVersioning;
