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

  export type TagType =
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

  export type Content = {
    website: {
      title: string;
      description: string;
      preview: string | null; // null = use our serverless screenshot service
      website: string;
      source: string | null;
      tags: TagType[];
    }[];
  };

  export type Options = Partial<PluginOptions>;

  export default function pluginShowcase(
    context: LoadContext,
    options: PluginOptions,
  ): Promise<Plugin<Content | null>>;

  export type ShowcaseMetadata = {
    /** Path to the Markdown source, with `@site` alias. */
    readonly source: string;
    /**
     * Used to generate the page h1 heading, tab title, and pagination title.
     */
    readonly title: string;
    /** Full link including base URL. */
    readonly permalink: string;
    /**
     * Description used in the meta. Could be an empty string (empty content)
     */
    readonly description: string;
    /** Front matter, as-is. */
    readonly frontMatter: Content['website'][number] & {[key: string]: unknown};
    /** Tags, normalized. */
    readonly tags: TagType[];
  };
}
