/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://github.com/facebook/docusaurus/issues/3360
// TODO find a better solution, this shouldn't be needed

// TODO this is  not ideal and produce a warning!
// see https://github.com/webpack/webpack/issues/7713#issuecomment-467888437
try {
  module.exports = require('@theme-init/hooks/useDocs');
} catch (e) {
  module.exports = {};
}

/*
throw new Error(
  "The docs plugin is not used, so you can't require the useDocs hooks. ",
);
 */
