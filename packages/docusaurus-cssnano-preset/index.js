/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const advancedBasePreset = require('cssnano-preset-advanced');
const postCssCombineDuplicatedSelectors = require('postcss-combine-duplicated-selectors');
const postCssSortMediaQueries = require('postcss-sort-media-queries');
const postCssRemoveOverriddenCustomProperties = require('./src/remove-overridden-custom-properties');

const preset = advancedBasePreset({autoprefixer: {add: true}});

preset.plugins.unshift(
  [postCssCombineDuplicatedSelectors, {removeDuplicatedValues: true}],
  [postCssSortMediaQueries],
  [postCssRemoveOverriddenCustomProperties],
);

module.exports = preset;
