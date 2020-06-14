/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {LoadContext, Plugin} from '@docusaurus/types';
import {normalizeUrl} from '@docusaurus/utils';

import path from 'path';

export default function pluginContentPages({
  siteConfig: {baseUrl},
}: LoadContext): Plugin<void> {
  return {
    name: 'docusaurus-plugin-debug',

    getThemePath() {
      return path.resolve(__dirname, '../src/theme');
    },

    contentLoaded({actions: {addRoute}}) {
      addRoute({
        path: normalizeUrl([baseUrl, '__docusaurus/debug']),
        component: '@theme/Debug',
        exact: true,
      });
    },
  };
}
