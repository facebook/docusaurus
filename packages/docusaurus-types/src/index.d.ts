/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Loader, Configuration} from 'webpack';
import {Command} from 'commander';
import {ParsedUrlQueryInput} from 'querystring';

export interface DocusaurusConfig {
  baseUrl: string;
  favicon: string;
  tagline: string;
  title: string;
  url: string;
  organizationName?: string;
  projectName?: string;
  githubHost?: string;
  plugins?: PluginConfig[];
  themes?: PluginConfig[];
  presets?: PresetConfig[];
  themeConfig?: {
    [key: string]: any;
  };
  customFields?: {
    [key: string]: any;
  };
  scripts?: (
    | string
    | {
        src: string;
        [key: string]: any;
      }
  )[];
  stylesheets?: (
    | string
    | {
        href: string;
        [key: string]: any;
      }
  )[];
}

export interface DocusaurusContext {
  siteConfig?: DocusaurusConfig;
}

export interface Preset {
  plugins?: PluginConfig[];
  themes?: PluginConfig[];
}

export type PresetConfig = [string, Object] | [string] | string;

export interface StartCLIOptions {
  port: string;
  host: string;
  hotOnly: boolean;
  open: boolean;
}

export interface BuildCLIOptions {
  bundleAnalyzer: boolean;
}

export interface LoadContext {
  siteDir: string;
  generatedFilesDir: string;
  siteConfig: DocusaurusConfig;
  outDir: string;
  baseUrl: string;
}

export interface HtmlTags {
  headTags: string;
  bodyTags: string;
}

export interface Props extends LoadContext, HtmlTags {
  routesPaths: string[];
  plugins: Plugin<any>[];
}

export interface PluginContentLoadedActions {
  addRoute(config: RouteConfig): void;
  createData(name: string, data: any): Promise<string>;
}

export interface Plugin<T> {
  name: string;
  loadContent?(): Promise<T>;
  contentLoaded?({
    content,
    actions,
  }: {
    content: T;
    actions: PluginContentLoadedActions;
  }): void;
  postBuild?(props: Props): void;
  postStart?(props: Props): void;
  configureWebpack?(
    config: Configuration,
    isServer: boolean,
    utils: ConfigureWebpackUtils,
  ): Configuration;
  getThemePath?(): string;
  getPathsToWatch?(): string[];
  getClientModules?(): string[];
  extendCli?(cli: Command): void;
  injectHtmlTags?(): {
    headTags?: HtmlTagObject | HtmlTagObject[];
    bodyTags?: HtmlTagObject | HtmlTagObject[];
  };
}

export type PluginConfig = [string, Object] | [string] | string;

export interface ChunkRegistry {
  loader: string;
  modulePath: string;
}

export type Module =
  | {
      path: string;
      __import?: boolean;
      query?: ParsedUrlQueryInput;
    }
  | string;

export interface RouteModule {
  [module: string]: Module | RouteModule | RouteModule[];
}

export interface ChunkNames {
  [name: string]: string | null | ChunkNames | ChunkNames[];
}

export interface RouteConfig {
  path: string;
  component: string;
  modules?: RouteModule;
  routes?: RouteConfig[];
  exact?: boolean;
  priority?: number;
}

export interface ThemeAlias {
  [alias: string]: string;
}

export interface ConfigureWebpackUtils {
  getStyleLoaders: (
    isServer: boolean,
    cssOptions: {
      [key: string]: any;
    },
  ) => Loader[];
  getCacheLoader: (isServer: boolean, cacheOptions?: {}) => Loader | null;
  getBabelLoader: (isServer: boolean, babelOptions?: {}) => Loader;
}

interface HtmlTagObject {
  /**
   * Attributes of the html tag
   * E.g. `{'disabled': true, 'value': 'demo', 'rel': 'preconnect'}`
   */
  attributes?: {
    [attributeName: string]: string | boolean;
  };
  /**
   * The tag name e.g. `div`, `script`, `link`, `meta`
   */
  tagName: string;
  /**
   * The inner HTML
   */
  innerHTML?: string;
}
