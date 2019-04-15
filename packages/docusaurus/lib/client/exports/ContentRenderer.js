/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Loadable from 'react-loadable';
import Loading from '@theme/Loading';
import cloneDeep from 'lodash/cloneDeep';
import routesAsyncModules from '@generated/routesAsyncModules';
import registry from '@generated/registry';

function ContentRenderer(props) {
  const {query, render} = props;
  const {id} = query;
  const modules = routesAsyncModules[id];
  const mappedModules = {};
  function traverseModules(module, path) {
    if (Array.isArray(module)) {
      module.forEach((value, index) => {
        traverseModules(value, [...path, index]);
      });
      return;
    }

    if (typeof module === 'object') {
      Object.keys(module).forEach(key => {
        traverseModules(module[key], [...path, key]);
      });
      return;
    }

    mappedModules[path.join('.')] = registry[module];
  }

  // Transform an object of {a: 'foo', b: {c:'bar}, d: ['baz', 'qux']} into
  // {
  //   a: () => import('foo'),
  //   b.c: () => import('foo'),
  //   d.0: () => import('baz'),
  //   d.1: () => import('qux'),
  // }
  // for React Loadable to process.
  traverseModules(modules, []);

  const LoadableComponent = Loadable.Map({
    loading: Loading,
    loader: mappedModules,
    render: loaded => {
      // Transform back loaded modules back into the nested format.
      const loadedModules = cloneDeep(modules);
      Object.keys(loaded).forEach(key => {
        let val = loadedModules;
        const keyPath = key.split('.');
        for (let i = 0; i < keyPath.length - 1; i += 1) {
          val = val[keyPath[i]];
        }
        val[keyPath[keyPath.length - 1]] = loaded[key].default;
      });

      return render(loadedModules, props);
    },
  });

  return <LoadableComponent />;
}

export default ContentRenderer;
