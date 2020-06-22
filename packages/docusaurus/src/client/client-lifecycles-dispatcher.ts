/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// too dynamic
/* eslint-disable @typescript-eslint/no-explicit-any */

import clientModules from '@generated/client-modules';

interface Dispatchers {
  onRouteUpdate: (...args: any) => void;
  onRouteUpdateDelayed: (...args: any) => void;
}

function dispatchLifecycleAction(
  lifecycleAction: keyof Dispatchers,
  ...args: any[]
) {
  clientModules.forEach((clientModule) => {
    const mod = clientModule.__esModule ? clientModule.default : clientModule;
    if (mod && mod[lifecycleAction]) {
      mod[lifecycleAction](...args);
    }
  });
}

const clientLifecyclesDispatchers: Dispatchers = {
  onRouteUpdate(...args) {
    dispatchLifecycleAction('onRouteUpdate', ...args);
  },
  onRouteUpdateDelayed(...args) {
    dispatchLifecycleAction('onRouteUpdateDelayed', ...args);
  },
};

export default clientLifecyclesDispatchers;
