/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// modules only used in tests

declare module 'to-vfile';

declare module 'remark-mdx';

declare module '@testing-utils/git' {
  const createTempRepo: typeof import('./utils/git').createTempRepo;
  export {createTempRepo};
}
