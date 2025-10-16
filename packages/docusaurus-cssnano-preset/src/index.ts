/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import advancedBasePreset from 'cssnano-preset-advanced';
import postCssSortMediaQueries from 'postcss-sort-media-queries';
import postCssRemoveOverriddenCustomProperties from './remove-overridden-custom-properties';

const preset: typeof advancedBasePreset = function preset(opts) {
  const advancedPreset = advancedBasePreset({
    autoprefixer: {add: false},
    discardComments: {removeAll: true},
    // See CodeBlock custom line number bug: https://github.com/facebook/docusaurus/pull/11487
    /* cSpell:ignore Idents */
    reduceIdents: {counter: false},
    /* cSpell:ignore zindex */
    zindex: false,
    ...opts,
  });

  advancedPreset.plugins.unshift(
    [postCssSortMediaQueries, undefined],
    [postCssRemoveOverriddenCustomProperties, undefined],
  );

  return advancedPreset;
};

// @ts-expect-error: TODO fix later
export = preset;
