/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {matchRoutes} from 'react-router-config';
import routesChunkNames from '@generated/routesChunkNames';
import routes from '@generated/routes';
import prefetchHelper from './prefetch';
import preloadHelper from './preload';
import flat from './flat';

const fetched: Record<string, boolean> = {};
const loaded: Record<string, boolean> = {};

declare global {
  // eslint-disable-next-line camelcase, @typescript-eslint/no-explicit-any
  const __webpack_require__: {gca: (name: string) => string};
  interface Navigator {
    connection: any;
  }
}

const isSlowConnection = () => {
  // If user is on slow or constrained connection.
  if (`connection` in navigator) {
    if (
      (navigator.connection.effectiveType || ``).indexOf(`2g`) !== -1 &&
      navigator.connection.saveData
    ) {
      return true;
    }
  }
  return false;
};

const canPrefetch = (routePath: string) =>
  !isSlowConnection() && !loaded[routePath] && !fetched[routePath];

const canPreload = (routePath: string) =>
  !isSlowConnection() && !loaded[routePath];

const flatten = <T>(arrays: T[][]): T[] =>
  Array.prototype.concat.apply([], arrays);

// Remove the last part containing the route hash
// input: /blog/2018/12/14/Happy-First-Birthday-Slash-fe9
// output: /blog/2018/12/14/Happy-First-Birthday-Slash
const removeRouteNameHash = (str: string) => str.replace(/(-[^-]+)$/, '');

const getChunkNamesToLoad = (path: string): string[] => {
  return flatten(
    Object.entries(routesChunkNames)
      .filter(
        ([routeNameWithHash]) =>
          removeRouteNameHash(routeNameWithHash) === path,
      )
      .map(([, routeChunks]) => {
        // flat() is useful for nested chunk names, it's not like array.flat()
        return Object.values(flat(routeChunks));
      }),
  );
};

const docusaurus = {
  prefetch: (routePath: string): boolean => {
    if (!canPrefetch(routePath)) {
      return false;
    }
    // Prevent future duplicate prefetch of routePath.
    fetched[routePath] = true;

    // Find all webpack chunk names needed.
    const matches = matchRoutes(routes, routePath);

    const chunkNamesNeeded = flatten(
      matches.map((match) => getChunkNamesToLoad(match.route.path as string)),
    );

    // Prefetch all webpack chunk assets file needed.
    chunkNamesNeeded.forEach((chunkName) => {
      // "__webpack_require__.gca" is a custom function provided by ChunkAssetPlugin.
      // Pass it the chunkName or chunkId you want to load and it will return the URL for that chunk.
      // eslint-disable-next-line no-undef
      const chunkAsset = __webpack_require__.gca(chunkName);

      // In some cases, webpack might decide to optimize further & hence the chunk assets are merged to another chunk/previous chunk.
      // Hence, we can safely filter it out/don't need to load it.
      if (chunkAsset && !/undefined/.test(chunkAsset)) {
        prefetchHelper(chunkAsset);
      }
    });

    return true;
  },

  preload: (routePath: string): boolean => {
    if (!canPreload(routePath)) {
      return false;
    }

    loaded[routePath] = true;
    preloadHelper(routes, routePath);
    return true;
  },
};

export default docusaurus;
