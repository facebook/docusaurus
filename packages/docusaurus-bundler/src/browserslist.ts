/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import browserslist from 'browserslist';
import {browserslistToTargets, type TransformOptions} from 'lightningcss';

// Used when the site doesn't provide its own Browserslist config
// See https://web.dev/baseline
const DefaultBrowserslistQueries = ['baseline widely available'];

export function getBrowserslistQueries(): string[] {
  return (
    browserslist.loadConfig({path: process.cwd()}) ?? DefaultBrowserslistQueries
  );
}

// LightningCSS doesn't expose any type for minimizer-webpack-plugin setup
// So we derive it ourselves
// see https://lightningcss.dev/docs.html#with-webpack
type LightningCssMinimizerOptions = Omit<
  TransformOptions<never>,
  'filename' | 'code'
>;

export function getLightningCssMinimizerOptions(): LightningCssMinimizerOptions {
  const browsers = browserslist(getBrowserslistQueries());
  return {targets: browserslistToTargets(browsers)};
}
