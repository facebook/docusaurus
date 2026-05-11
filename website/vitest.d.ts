/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import 'vitest';

// See https://vitest.dev/guide/extending-matchers
declare module 'vitest' {
  interface Matchers<R> {
    toHaveGoodDimensions: () => R;
  }
}
