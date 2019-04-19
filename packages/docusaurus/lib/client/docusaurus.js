/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {matchRoutes} from 'react-router-config';
import routesChunkNames from '@generated/routesChunkNames';
import routes from '@generated/routes'; // eslint-disable-line
import prefetchHelper from './prefetch';
import preloadHelper from './preload';

const fetched = {};

const canPrefetchOrLoad = routePath => {
  // if user is on slow or constrained connection
  if (`connection` in navigator) {
    if ((navigator.connection.effectiveType || ``).includes(`2g`)) {
      return false;
    }
    if (navigator.connection.saveData) {
      return false;
    }
  }
  return !fetched[routePath];
};

const docusaurus = {
  prefetch: routePath => {
    if (!canPrefetchOrLoad(routePath)) {
      return false;
    }
    fetched[routePath] = true;

    // Find all chunk names needed for that particular route
    const chunkNamesNeeded = [];
    function dfs(target) {
      if (!target) {
        return;
      }
      if (Array.isArray(target)) {
        target.forEach(value => {
          dfs(value);
        });
        return;
      }

      if (typeof target === 'object') {
        Object.keys(target).forEach(key => {
          dfs(target[key]);
        });
        return;
      }
      chunkNamesNeeded.push(target);
    }
    const matches = matchRoutes(routes, routePath);
    matches.map(match => dfs(routesChunkNames[match.route.path]));

    // Prefetch all the chunks assets file needed
    const chunkAssetsNeeded = chunkNamesNeeded.reduce((arr, chunkName) => {
      const chunkAssets = window.__chunkMapping[chunkName];
      return arr.concat(chunkAssets);
    }, []);
    chunkAssetsNeeded.map(prefetchHelper);
    return true;
  },
  preload: routePath => {
    if (!canPrefetchOrLoad(routePath)) {
      return false;
    }
    fetched[routePath] = true;
    preloadHelper(routes, routePath);
    return true;
  },
};

export default docusaurus;
