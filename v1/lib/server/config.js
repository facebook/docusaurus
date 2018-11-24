/**
 * Copyright (c) 2017-present, Facebook, Inc.
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

  /* docsUrl */
  if (config.docsUrl && (config.docsUrl === '' || config.docsUrl === '/')) {
    config.docsUrl = '';
  } else if (!config.docsUrl) {
    config.docsUrl = 'docs';
  }

  return config;
};
