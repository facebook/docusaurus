/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import clientModules from '@generated/client-modules';

function dispatchLifecycleAction(lifecycleAction, ...args) {
  clientModules.forEach(clientModule => {
    const mod = clientModule.__esModule ? clientModule.default : clientModule;
    if (mod && mod[lifecycleAction]) {
      mod[lifecycleAction](...args);
    }
  });
}

function createLifecyclesDispatcher() {
  // TODO: Not sure whether it's better to declare an explicit object
  // with all the lifecycles. It's better for typing but quite verbose.
  // On the other hand, there's some runtime cost generating this object
  // on initial load.
  return ['onRouteUpdate', 'onRouteUpdateDelayed'].reduce(
    (lifecycles, lifecycleAction) => {
      // eslint-disable-next-line no-param-reassign
      lifecycles[lifecycleAction] = function(...args) {
        dispatchLifecycleAction(lifecycleAction, ...args);
      };
      return lifecycles;
    },
    {},
  );
}

export default createLifecyclesDispatcher();
