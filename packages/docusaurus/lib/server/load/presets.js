/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const importFresh = require('import-fresh');
const _ = require('lodash');
const fs = require('fs-extra');

module.exports = function loadPresets(context) {
  const presets = context.siteConfig.presets || [];
  return _.flatten(
    presets.map(presetItem => {
      let presetModule;
      let presetOptions = {};
      if (typeof presetItem === 'string') {
        presetModule = presetItem;
      } else if (Array.isArray(presetItem)) {
        [presetModule, presetOptions] = presetItem;
      }

      let preset;
      if (presetModule && fs.existsSync(presetModule)) {
        // Local preset.
        preset = importFresh(presetModule);
      } else {
        // From npm.
        preset = importFresh(presetModule);
      }
      return preset(context, presetOptions).plugins;
    }),
  );
};
