/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export {
  default,
  // Extra named export to avoid problems in ESM modules (create-docusaurus)
  // See https://github.com/facebook/docusaurus/pull/6661
  // See https://github.com/facebook/docusaurus/pull/7295
  default as logger,
} from './logger';

export {PerfLogger} from './perfLogger';
