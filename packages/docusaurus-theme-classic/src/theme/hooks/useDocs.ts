/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://github.com/facebook/docusaurus/issues/3360
// TODO find a better solution, this shouldn't be needed

// TODO this is not ideal and produce a warning!
// see https://github.com/webpack/webpack/issues/7713#issuecomment-467888437
// note: warning can be filtered: https://github.com/facebook/docusaurus/pull/3382#issuecomment-684966924
try {
  // eslint-disable-next-line global-require
  module.exports = require('@theme-init/hooks/useDocs');
} catch (e) {
  // In case the docs plugin is not available, might be useful to stub some methods here
  // https://github.com/facebook/docusaurus/issues/3947
  const Empty = {};
  module.exports = {
    useAllDocsData: () => Empty,
    useActivePluginAndVersion: () => undefined,
  };
}

/*
throw new Error(
  "The docs plugin is not used, so you can't require the useDocs hooks. ",
);
 */
