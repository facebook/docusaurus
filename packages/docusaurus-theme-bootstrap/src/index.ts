/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import type {Plugin} from '@docusaurus/types';

export default function docusaurusThemeBootstrap(): Plugin<void> {
  return {
    name: 'docusaurus-theme-bootstrap',
    getThemePath() {
      return path.resolve(__dirname, '..', 'lib', 'theme');
    },
    getTypeScriptThemePath() {
      return path.resolve(__dirname, './theme');
    },
    getClientModules() {
      return [require.resolve('bootstrap/dist/css/bootstrap.min.css')];
    },
  };
}
