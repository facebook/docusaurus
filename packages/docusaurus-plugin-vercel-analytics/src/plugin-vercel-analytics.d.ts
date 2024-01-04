/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-vercel-analytics' {
  export type PluginOptions = {
    /**
     * Turn debug mode on
     */
    debug?: boolean;
    /**
     * TODO add description
     */
    mode: 'auto' | 'development' | 'production';
  };

  export type Options = Partial<PluginOptions>;
}
