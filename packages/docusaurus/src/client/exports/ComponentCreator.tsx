/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Loadable from 'react-loadable';
import Loading from '@theme/Loading';
import routesChunkNames from '@generated/routesChunkNames';
import registry from '@generated/registry';
import flat from '../flat';
import {RouteContextProvider} from '../routeContext';

export default function ComponentCreator(
  path: string,
  hash: string,
): ReturnType<typeof Loadable> {
  // 404 page
  if (path === '*') {
    return Loadable({
      loading: Loading,
      loader: async () => {
        const NotFound = (await import('@theme/NotFound')).default;
        return (props) => (
          // Is there a better API for this?
          <RouteContextProvider
            value={{plugin: {name: 'native', id: 'default'}}}>
            <NotFound {...(props as never)} />
          </RouteContextProvider>
        );
      },
    });
  }

  const chunkNames = routesChunkNames[`${path}-${hash}`]!;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optsLoader: {[key: string]: () => Promise<any>} = {};
  const optsModules: string[] = [];
  const optsWebpack: string[] = [];

  const flatChunkNames = flat(chunkNames);
  Object.entries(flatChunkNames).forEach(([key, chunkName]) => {
    const chunkRegistry = registry[chunkName];
    if (chunkRegistry) {
      // eslint-disable-next-line prefer-destructuring
      optsLoader[key] = chunkRegistry[0];
      optsModules.push(chunkRegistry[1]);
      optsWebpack.push(chunkRegistry[2]);
    }
  });

  return Loadable.Map({
    loading: Loading,
    loader: optsLoader,
    modules: optsModules,
    webpack: () => optsWebpack,
    render: (loaded, props) => {
      // Clone the original object since we don't want to alter the original.
      const loadedModules = JSON.parse(JSON.stringify(chunkNames));
      Object.keys(loaded).forEach((key) => {
        const newComp = loaded[key].default;
        if (!newComp) {
          throw new Error(
            `The page component at ${path} doesn't have a default export. This makes it impossible to render anything. Consider default-exporting a React component.`,
          );
        }
        if (typeof newComp === 'object' || typeof newComp === 'function') {
          Object.keys(loaded[key])
            .filter((k) => k !== 'default')
            .forEach((nonDefaultKey) => {
              newComp[nonDefaultKey] = loaded[key][nonDefaultKey];
            });
        }
        let val = loadedModules;
        const keyPath = key.split('.');
        keyPath.slice(0, -1).forEach((k) => {
          val = val[k];
        });
        val[keyPath[keyPath.length - 1]!] = newComp;
      });

      const Component = loadedModules.component;
      delete loadedModules.component;

      /* eslint-disable no-underscore-dangle */
      const routeContextModule = loadedModules.__routeContextModule;
      delete loadedModules.__routeContextModule;
      /* eslint-enable no-underscore-dangle */

      // Is there any way to put this RouteContextProvider upper in the tree?
      return (
        <RouteContextProvider value={routeContextModule}>
          <Component {...loadedModules} {...props} />
        </RouteContextProvider>
      );
    },
  });
}
