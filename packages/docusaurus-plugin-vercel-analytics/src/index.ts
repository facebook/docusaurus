/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Plugin} from '@docusaurus/types';

export default function pluginVercelAnalytics(): Plugin {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    name: 'docusaurus-plugin-vercel-analytics',

    getClientModules() {
      return isProd ? ['./analytics'] : [];
    },
  };
}
