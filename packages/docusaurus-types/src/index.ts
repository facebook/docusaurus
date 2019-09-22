import {Loader, Configuration} from 'webpack';
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
}

export interface DocusaurusContext {
  siteConfig?: Partial<DocusaurusConfig>;
}

export interface Preset {
  plugins?: PluginConfig[];
  themes?: PluginConfig[];
}

export type PresetConfig = [string, Object] | [string] | string;

export interface CLIOptions {
  [option: string]: any;
}

export interface LoadContext {
  siteDir: string;
  generatedFilesDir: string;
  siteConfig: Partial<DocusaurusConfig>;
  cliOptions: CLIOptions;
  outDir: string;
  baseUrl: string;
}

export interface Props extends LoadContext {
  routesPaths: string[];
  plugins: Plugin<any>[];
}

export interface PluginContentLoadedActions {
  addRoute(config: RouteConfig): void;
  createData(name: string, data: Object): Promise<string>;
}

export interface Plugin<T> {
  name: string;
  loadContent?(): T;
  contentLoaded?({
    content,
    actions,
  }: {
    content: T;
    actions: PluginContentLoadedActions;
  }): void;
  postBuild?(props: Props): void;
  postStart?(props: Props): void;
  configureWebpack?(config: Configuration, isServer: boolean): Configuration;
  getThemePath?(): string;
  getPathsToWatch?(): string[];
  getClientModules?(): string[];
}

export type PluginConfig = [string, Object | undefined] | string;

export interface ChunkRegistry {
  importStatement: string;
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

export interface RouteConfig {
  path: string;
  component: string;
  modules?: RouteModule;
  routes?: RouteConfig[];
  exact?: boolean;
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
