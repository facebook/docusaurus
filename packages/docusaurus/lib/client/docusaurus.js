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

function flatten(target) {
  const delimiter = '.';
  const output = {};

  function step(object, prev) {
    Object.keys(object).forEach(key => {
      const value = object[key];
      const isArray = Array.isArray(value);
      const type = typeof value;
      const isObject = type === 'object' && !!value;
      const newKey = prev ? prev + delimiter + key : key;

      if (!isArray && isObject && Object.keys(value).length) {
        step(value, newKey);
        return;
      }
      output[newKey] = value;
    });
  }
  step(target);
  return output;
}

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

    // Find all webpack chunk names needed
    const matches = matchRoutes(routes, routePath);
    const chunkNamesNeeded = matches.reduce((arr, match) => {
      const chunkNames = Object.values(
        flatten(routesChunkNames[match.route.path]),
      );
      return arr.concat(chunkNames);
    }, []);

    // Prefetch all webpack chunk assets file needed
    const chunkAssetsNeeded = chunkNamesNeeded.reduce((arr, chunkName) => {
      const chunkAssets = window.__chunkMapping[chunkName] || [];
      return arr.concat(chunkAssets);
    }, []);
    const dedupedChunkAssets = Array.from(new Set(chunkAssetsNeeded));
    dedupedChunkAssets.map(prefetchHelper);
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
