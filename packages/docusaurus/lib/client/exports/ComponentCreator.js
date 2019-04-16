/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Loadable from 'react-loadable';
import Loading from '@theme/Loading';
import routesAsyncModules from '@generated/routesAsyncModules';
import registry from '@generated/registry';

function ComponentCreator(path) {
  const modules = routesAsyncModules[path];
  const originalModules = modules;
  const optsModules = [];
  const optsWebpack = [];
  const mappedModules = {};

  // Transform an object of
  // {
  //   a: 'foo',
  //   b: { c: 'bar' },
  //   d: ['baz', 'qux']
  // }
  // into
  // {
  //   a: () => import('foo'),
  //   b.c: () => import('bar'),
  //   d.0: () => import('baz'),
  //   d.1: () => import('qux'),
  // }
  // for React Loadable to process.
  function traverseModules(module, keys) {
    if (Array.isArray(module)) {
      module.forEach((value, index) => {
        traverseModules(value, [...keys, index]);
      });
      return;
    }

    if (typeof module === 'object') {
      Object.keys(module).forEach(key => {
        traverseModules(module[key], [...keys, key]);
      });
      return;
    }

    mappedModules[keys.join('.')] = registry[module].importStatement;
    optsModules.push(registry[module].module);
    optsWebpack.push(registry[module].webpack);
  }

  traverseModules(modules, []);

  return Loadable.Map({
    loading: Loading,
    loader: mappedModules,
    // We need to provide opts.modules and opts.webpack to React Loadable
    // Our loader is now dynamical, the react-loadable/babel won't do the heavy lifting for us.
    // https://github.com/jamiebuilds/react-loadable#declaring-which-modules-are-being-loaded
    modules: optsModules,
    webpack: () => optsWebpack,
    render: (loaded, props) => {
      // Transform back loaded modules back into the original structure.
      const loadedModules = originalModules;
      Object.keys(loaded).forEach(key => {
        let val = loadedModules;
        const keyPath = key.split('.');
        for (let i = 0; i < keyPath.length - 1; i += 1) {
          val = val[keyPath[i]];
        }
        val[keyPath[keyPath.length - 1]] = loaded[key].default;
      });

      const Component = loadedModules.component;
      delete loadedModules.component;
      return <Component {...loadedModules} {...props} />;
    },
  });
}

export default ComponentCreator;
