/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// fork of Buble which removes Buble's large dependency and weighs in
// at a smaller size of ~51kB
// https://github.com/FormidableLabs/react-live#what-bundle-size-can-i-expect
import {transform, features as bubleFeatures} from '@philpl/buble';

function customTransform(source, options) {
  return transform(source, {...options, transforms: {asyncAwait: false}});
}

export {bubleFeatures as features, customTransform as transform};
