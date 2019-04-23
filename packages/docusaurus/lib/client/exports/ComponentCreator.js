/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Loadable from 'react-loadable';
import Loading from '@theme/Loading';
import routesChunkNames from '@generated/routesChunkNames';
import registry from '@generated/registry';

function ComponentCreator(path) {
  const chunkNames = routesChunkNames[path];
  const optsModules = [];
  const optsWebpack = [];
  const optsLoader = {};

  /* Prepare opts data that react-loadable needs
  https://github.com/jamiebuilds/react-loadable#declaring-which-modules-are-being-loaded
  Example:
  - optsLoader: 
  {
    component: () => import('./Pages.js'),
    content.foo: () => import('./doc1.md'),
  }
  - optsModules: ['./Pages.js', './doc1.md']
  - optsWebpack: [require.resolveWeak('./Pages.js'), require.resolveWeak('./doc1.md')]
  */
  function traverseChunk(target, keys) {
    if (Array.isArray(target)) {
      target.forEach((value, index) => {
        traverseChunk(value, [...keys, index]);
      });
      return;
    }

    if (typeof target === 'object') {
      Object.keys(target).forEach(key => {
        traverseChunk(target[key], [...keys, key]);
      });
      return;
    }

    const chunkRegistry = registry[target] || {};
    optsLoader[keys.join('.')] = chunkRegistry.importStatement;
    optsModules.push(chunkRegistry.module);
    optsWebpack.push(chunkRegistry.webpack);
  }

  traverseChunk(chunkNames, []);

  return Loadable.Map({
    loading: Loading,
    loader: optsLoader,
    modules: optsModules,
    webpack: () => optsWebpack,
    render: (loaded, props) => {
      // clone the original object since we don't want to alter the original.
      const loadedModules = JSON.parse(JSON.stringify(chunkNames));
      Object.keys(loaded).forEach(key => {
        let val = loadedModules;
        const keyPath = key.split('.');
        for (let i = 0; i < keyPath.length - 1; i += 1) {
          val = val[keyPath[i]];
        }
        val[keyPath[keyPath.length - 1]] = loaded[key].default;
        const nonDefaultKeys = Object.keys(loaded[key]).filter(
          k => k !== 'default',
        );
        if (nonDefaultKeys && nonDefaultKeys.length) {
          nonDefaultKeys.forEach(nonDefaultKey => {
            val[keyPath[keyPath.length - 1]][nonDefaultKey] =
              loaded[key][nonDefaultKey];
          });
        }
      });

      const Component = loadedModules.component;
      delete loadedModules.component;
      return <Component {...loadedModules} {...props} />;
    },
  });
}

export default ComponentCreator;
