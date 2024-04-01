/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-content-showcase' {
  import type {LoadContext, Plugin} from '@docusaurus/types';

  export type TagOption = {
    [key: string]: {
      label: string;
      description: {
        message: string;
        id: string;
      };
      color: string;
    };
  };

  export type PluginOptions = {
    id?: string;
    path: string;
    routeBasePath: string;
    include: string[];
    exclude: string[];
    tags: string | TagOption[];
  };

  type TagType =
    | 'favorite'
    | 'opensource'
    | 'product'
    | 'design'
    | 'i18n'
    | 'versioning'
    | 'large'
    | 'meta'
    | 'personal'
    | 'rtl';

  export type ShowcaseFrontMatter = {
    readonly title: string;
    readonly description: string;
    readonly preview: string | null; // null = use our serverless screenshot service
    readonly website: string;
    readonly source: string | null;
    readonly tags: TagType[];
  };

  export type ShowcaseItem = {
    items: ShowcaseFrontMatter[];
  };

  export type Options = Partial<PluginOptions>;

  export default function pluginContentShowcase(
    context: LoadContext,
    options: PluginOptions,
  ): Promise<Plugin<ShowcaseItem | null>>;
}
