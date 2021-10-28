/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const advancedBasePreset = require('cssnano-preset-advanced');
const postCssSortMediaQueries = require('postcss-sort-media-queries');
const postCssRemoveOverriddenCustomProperties = require('./src/remove-overridden-custom-properties');

module.exports = function docusaurusCssnanoPreset(opts) {
  const advancedPreset = advancedBasePreset({
    autoprefixer: {add: false},
    discardComments: {removeAll: true},
    ...opts,
  });

  advancedPreset.plugins.unshift(
    [postCssSortMediaQueries],
    [postCssRemoveOverriddenCustomProperties],
  );

  return advancedPreset;
};
