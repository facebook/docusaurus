/**
 * Copyright (c) 2017-present, Facebook, Inc.
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

const fetched = {};
const loaded = {};

const isSlowConnection = () => {
  // if user is on slow or constrained connection
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

const canPrefetch = routePath =>
  !isSlowConnection() && !loaded[routePath] && !fetched[routePath];

const canPreload = routePath => !isSlowConnection() && !loaded[routePath];

const docusaurus = {
  prefetch: routePath => {
    if (!canPrefetch(routePath)) {
      return false;
    }
    // prevent future duplicate prefetch of routePath
    fetched[routePath] = true;

    // Find all webpack chunk names needed
    const matches = matchRoutes(routes, routePath);
    const chunkNamesNeeded = matches.reduce((arr, match) => {
      const chunk = routesChunkNames[match.route.path];
      if (!chunk) {
        return arr;
      }

      const chunkNames = Object.values(flat(chunk));
      return arr.concat(chunkNames);
    }, []);

    // Prefetch all webpack chunk assets file needed
    const chunkAssetsNeeded = chunkNamesNeeded.reduce((arr, chunkName) => {
      // "__webpack_require__.gca" is a custom function provided by ChunkAssetPlugin
      // Pass it the chunkName or chunkId you want to load.
      // For example: if you have a chunk named "my-chunk-name" that will map to "/0a84b5e7.c8e35c7a.js" as its corresponding output path
      // __webpack_require__.gca("my-chunk-name") will return "/0a84b5e7.c8e35c7a.js"
      // eslint-disable-next-line no-undef
      const chunkAssets = __webpack_require__.gca(chunkName) || [];
      return arr.concat(chunkAssets);
    }, []);

    chunkAssetsNeeded.map(prefetchHelper);
    return true;
  },
  preload: routePath => {
    if (!canPreload(routePath)) {
      return false;
    }
    loaded[routePath] = true;
    preloadHelper(routes, routePath);
    return true;
  },
};

export default docusaurus;
