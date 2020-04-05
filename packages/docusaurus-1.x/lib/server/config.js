/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');

module.exports = function loadConfig(configPath, deleteCache = true) {
  if (deleteCache) {
    delete require.cache[configPath];
  }
  let config = {};
  if (fs.existsSync(configPath)) {
    config = require(configPath); // eslint-disable-line
  }

  /* Fill default value */
  const defaultConfig = {
    customDocsPath: 'docs',
    docsUrl: 'docs',
  };
  Object.keys(defaultConfig).forEach(field => {
    if (!(field in config)) {
      config[field] = defaultConfig[field];
    }
  });

  return config;
};
