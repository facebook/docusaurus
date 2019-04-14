/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import routesAsyncModules from '@generated/routesAsyncModules';
import Loadable from 'react-loadable';
import Loading from '@theme/Loading';
import registry from '@generated/registry';

function ContentRenderer(props) {
  const {query, render} = props;
  const {id} = query;
  const modules = routesAsyncModules[id];
  const mappedModules = {};
  Object.keys(modules).map(key => {
    mappedModules[key] = registry[modules[key]];
  });

  const LoadableComponent = Loadable.Map({
    loading: Loading,
    loader: mappedModules,
    render: loaded => {
      Object.keys(loaded).map(key => {
        loaded[key] = loaded[key].default;
      });
      return render(loaded, props);
    },
  });

  return <LoadableComponent />;
}

export default ContentRenderer;
