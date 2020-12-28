/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// fork of Buble which removes Buble's large dependency and weighs in
// at a smaller size of ~51kB
// https://github.com/FormidableLabs/react-live#what-bundle-size-can-i-expect
const {transform, features: bubleFeatures} = require('@philpl/buble');

// This file is designed to mimic what's written in
// https://github.com/kitten/buble/blob/mini/src/index.js, with custom transforms options,
// so that webpack can consume it correctly.
exports.features = bubleFeatures;

exports.transform = function customTransform(source, options) {
  return transform(source, {...options, transforms: {asyncAwait: false}});
};
