/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// fork of Buble which removes Buble's large dependency and weighs in
// at a smaller size of ~51kB
// https://github.com/FormidableLabs/react-live#what-bundle-size-can-i-expect
import {
  transform as bubleTransform,
  type TransformOptions,
  type TransformOutput,
} from '@philpl/buble';

// This file is designed to mimic what's written in
// https://github.com/kitten/buble/blob/mini/src/index.js, with custom transforms options,
// so that webpack can consume it correctly.
export {features} from '@philpl/buble';

export function transform(
  source: string,
  options: TransformOptions,
): TransformOutput {
  return bubleTransform(source, {
    ...options,
    transforms: {
      asyncAwait: false,
      classes: false,
      getterSetter: false,
      ...options.transforms,
    },
  });
}
