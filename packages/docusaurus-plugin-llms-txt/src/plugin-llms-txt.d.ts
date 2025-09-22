/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-llms-txt' {
  export type PluginOptions = {
    /**
     * The filename for the llms.txt file.
     * @default "llms.txt"
     */
    filename: string;

    /**
     * The title of the site to include in llms.txt.
     * If not provided, will use siteConfig.title.
     */
    siteTitle?: string;

    /**
     * The description of the site to include in llms.txt.
     * If not provided, will use siteConfig.tagline.
     */
    siteDescription?: string;

    /**
     * Include blog posts in the llms.txt file.
     * @default true
     */
    includeBlog: boolean;

    /**
     * Include documentation pages in the llms.txt file.
     * @default true
     */
    includeDocs: boolean;

    /**
     * Include static pages in the llms.txt file.
     * @default true
     */
    includePages: boolean;

    /**
     * Maximum depth of content hierarchy to include.
     * @default 3
     */
    maxDepth: number;

    /**
     * Exclude routes matching these patterns.
     * @default []
     */
    excludeRoutes: string[];

    /**
     * Additional custom content to include in the llms.txt file.
     */
    customContent?: string;

    /**
     * Include full content of pages in addition to links.
     * @default false
     */
    includeFullContent: boolean;
  };

  export type Options = Partial<PluginOptions>;

  export interface LlmsTxtEntry {
    title: string;
    url: string;
    description?: string;
    content?: string;
    type: 'doc' | 'blog' | 'page';
    lastModified?: string;
  }

  export interface LlmsTxtContent {
    siteTitle: string;
    siteDescription: string;
    siteUrl: string;
    entries: LlmsTxtEntry[];
    lastUpdated: string;
  }
}

declare module '@docusaurus/types' {
  interface Config {
    plugins?: PluginConfig[];
  }
}
