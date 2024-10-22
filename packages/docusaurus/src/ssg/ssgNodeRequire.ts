/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRequire} from 'module';

export type SSGNodeRequire = {
  require: NodeJS.Require;
  cleanup: () => void;
};

// The eval/vm.Script used for running the server bundle need a require() impl
// This impl has to be relative to the server bundler path
// This enables the server bundle to resolve relative paths such as:
// - require('./assets/js/some-chunk.123456.js')
//
// Unfortunately, Node.js vm.Script doesn't isolate memory / require.cache
// This means that if we build multiple Docusaurus localized sites in a row
// The Node.js require cache will keep growing and retain in memory the JS
// assets of the former SSG builds
// We have to clean up the node require cache manually to avoid leaking memory!
// See also https://x.com/sebastienlorber/status/1848399310116831702
export function createSSGRequire(serverBundlePath: string): SSGNodeRequire {
  const realRequire = createRequire(serverBundlePath);

  const allRequiredIds: string[] = [];

  const ssgRequireFunction: NodeJS.Require = (id) => {
    const module = realRequire(id);
    allRequiredIds.push(id);
    return module;
  };

  const cleanup = () => {
    allRequiredIds.forEach((id) => {
      delete realRequire.cache[realRequire.resolve(id)];
    });
  };

  ssgRequireFunction.resolve = realRequire.resolve;
  ssgRequireFunction.cache = realRequire.cache;
  ssgRequireFunction.extensions = realRequire.extensions;
  ssgRequireFunction.main = realRequire.main;

  return {require: ssgRequireFunction, cleanup};
}
