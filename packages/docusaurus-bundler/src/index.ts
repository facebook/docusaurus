/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export {printStatsWarnings, formatStatsErrorMessage, compile} from './compiler';

export {
  getCurrentBundler,
  getCSSExtractPlugin,
  getCopyPlugin,
  getProgressBarPlugin,
} from './currentBundler';

export {getMinimizers} from './minification';
export {
  getHtmlMinifier,
  type HtmlMinifier,
  type HtmlMinifierType,
} from './minifyHtml';
export {createJsLoaderFactory} from './loaders/jsLoader';
export {createStyleLoadersFactory} from './loaders/styleLoader';
