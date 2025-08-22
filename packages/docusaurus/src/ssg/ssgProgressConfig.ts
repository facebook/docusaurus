/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Environment variable to control SSG progress display.
 * Set to 'false' or '0' to disable the progress indicator.
 * By default, progress is shown when building static files.
 */
export const SSG_PROGRESS_ENABLED = 
  process.env.DOCUSAURUS_SSG_PROGRESS_DISABLED !== 'true' &&
  process.env.DOCUSAURUS_SSG_PROGRESS_DISABLED !== '1';

/**
 * Environment variable to control progress bar style.
 * Options: 'bar' (default), 'simple', 'verbose'
 */
export const SSG_PROGRESS_STYLE = 
  process.env.DOCUSAURUS_SSG_PROGRESS_STYLE || 'bar';
