/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ParsedUrlQueryInput} from 'querystring';

/**
 * A "module" represents a unit of serialized data emitted from the plugin. It
 * will be imported on client-side and passed as props, context, etc.
 *
 * If it's a string, it's a file path that Webpack can `require`; if it's
 * an object, it can also contain `query` or other metadata.
 */
export type Module =
  | {
      /**
       * A marker that tells the route generator this is an import and not a
       * nested object to recurse.
       */
      __import?: boolean;
      path: string;
      query?: ParsedUrlQueryInput;
    }
  | string;

/**
 * Represents the data attached to each route. Since the routes.js is a
 * monolithic data file, any data (like props) should be serialized separately
 * and registered here as file paths (a {@link Module}), so that we could
 * code-split.
 */
export type RouteModules = {
  [propName: string]: Module | RouteModules | RouteModules[];
};

/**
 * Represents a "slice" of the final route structure returned from the plugin
 * `addRoute` action.
 */
export type RouteConfig = {
  /** With leading slash. Trailing slash will be normalized by config. */
  path: string;
  /** Component used to render this route, a path that Webpack can `require`. */
  component: string;
  /**
   * Props. Each entry should be `[propName]: pathToPropModule` (created with
   * `createData`)
   */
  modules?: RouteModules;
  /**
   * The route context will wrap the `component`. Use `useRouteContext` to
   * retrieve what's declared here. Note that all custom route context declared
   * here will be namespaced under {@link RouteContext.data}.
   */
  context?: RouteModules;
  /** Nested routes config. */
  routes?: RouteConfig[];
  /** React router config option: `exact` routes would not match subroutes. */
  exact?: boolean;
  /**
   * React router config option: `strict` routes are sensitive to the presence
   * of a trailing slash.
   */
  strict?: boolean;
  /** Used to sort routes. Higher-priority routes will be placed first. */
  priority?: number;
  /** Extra props; will be copied to routes.js. */
  [propName: string]: unknown;
};

export type RouteContext = {
  /**
   * Plugin-specific context data.
   */
  data?: object | undefined;
};

/**
 * Top-level plugin routes automatically add some context data to the route.
 * This permits us to know which plugin is handling the current route.
 */
export type PluginRouteContext = RouteContext & {
  plugin: {
    id: string;
    name: string;
  };
};

/**
 * The shape would be isomorphic to {@link RouteModules}:
 * {@link Module} -> `string`, `RouteModules[]` -> `ChunkNames[]`.
 *
 * Each `string` chunk name will correlate with one key in the {@link Registry}.
 */
export type ChunkNames = {
  [propName: string]: string | ChunkNames | ChunkNames[];
};

/**
 * A map from route paths (with a hash) to the chunk names of each module, which
 * the bundler will collect.
 *
 * Chunk keys are routes with a hash, because 2 routes can conflict with each
 * other if they have the same path, e.g.: parent=/docs, child=/docs
 *
 * @see https://github.com/facebook/docusaurus/issues/2917
 */
export type RouteChunkNames = {
  [routePathHashed: string]: ChunkNames;
};

/**
 * Each key is the chunk name, which you can get from `routeChunkNames` (see
 * {@link RouteChunkNames}). The values are the opts data that react-loadable
 * needs. For example:
 *
 * ```js
 * const options = {
 *   optsLoader: {
 *     component: () => import('./Pages.js'),
 *     content.foo: () => import('./doc1.md'),
 *   },
 *   optsModules: ['./Pages.js', './doc1.md'],
 *   optsWebpack: [
 *     require.resolveWeak('./Pages.js'),
 *     require.resolveWeak('./doc1.md'),
 *   ],
 * }
 * ```
 *
 * @see https://github.com/jamiebuilds/react-loadable#declaring-which-modules-are-being-loaded
 */
export type Registry = {
  readonly [chunkName: string]: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Loader: () => Promise<any>,
    ModuleName: string,
    ResolvedModuleName: string,
  ];
};
