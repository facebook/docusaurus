import {Loader} from 'webpack';
import {ParsedUrlQueryInput} from 'querystring';

export interface DocusaurusConfig {
  baseUrl: string;
  favicon?: string;
  tagline?: string;
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
  siteConfig?: DocusaurusConfig;
}

export type PluginConfig = [string, Object | undefined] | string;

export type PresetConfig = [string, Object | undefined] | string;

export interface CLIOptions {
  [option: string]: any;
}

export interface LoadContext {
  siteDir: string;
  generatedFilesDir?: string;
  siteConfig: DocusaurusConfig;
  cliOptions?: CLIOptions;
  outDir?: string;
  baseUrl?: string;
}

export interface PluginContentLoadedActions {
  addRoute(config: RouteConfig): void;
  createData(name: string, data: Object): Promise<string>;
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
