/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-showcase' {
  import type {LoadContext, Plugin} from '@docusaurus/types';

  export type Assets = {
    image?: string;
  };

  export type PluginOptions = {
    id?: string;
    path: string;
    routeBasePath: string;
  };

  export type Content = {
    title: string;
    author: string;
  };

  export type Options = Partial<PluginOptions>;

  export default function pluginShowcase(
    context: LoadContext,
    options: PluginOptions,
  ): Promise<Plugin<LoadedContent | null>>;
}
