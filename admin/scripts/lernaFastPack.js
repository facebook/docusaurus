/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Preload making `lerna publish` pack our packages much faster:
// node --import ./admin/scripts/lernaFastPack.js <lerna-cli-path> publish
//
// Lerna packs each package with `new Arborist({path}).loadActual()` and passes
// the tree to npm-packlist. With the pnpm isolated nodeLinker, Arborist tries
// to resolve dependency edges by walking up into node_modules/.pnpm and loads
// thousands of nodes for each package, taking minutes in CI.
// npm-packlist only reads that tree for bundleDependencies, which we don't
// use: skipping the walk with ignoreMissing produces the same tarballs.

import {createRequire} from 'node:module';

// Patch the Arborist copy that Lerna resolves
const require = createRequire(import.meta.resolve('lerna'));
const Arborist = require('@npmcli/arborist');

const {loadActual} = Arborist.prototype;
Arborist.prototype.loadActual = function loadActualIgnoreMissing(options) {
  return loadActual.call(this, {ignoreMissing: true, ...options});
};
