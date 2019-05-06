/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const importFresh = require('import-fresh');
const _ = require('lodash');

module.exports = function loadPresets(context) {
  const presets = context.siteConfig.presets || [];
  const plugins = [];
  const themes = [];

  presets.forEach(presetItem => {
    let presetModule;
    let presetOptions = {};
    if (typeof presetItem === 'string') {
      presetModule = presetItem;
    } else if (Array.isArray(presetItem)) {
      [presetModule, presetOptions] = presetItem;
    }

    const preset = importFresh(presetModule);
    plugins.push(preset(context, presetOptions).plugins);
    themes.push(preset(context, presetOptions).themes);
  });

  return {
    plugins: _.compact(_.flatten(plugins)),
    themes: _.compact(_.flatten(themes)),
  };
};
