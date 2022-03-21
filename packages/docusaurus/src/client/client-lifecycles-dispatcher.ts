/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import clientModules from '@generated/client-modules';
import type {ClientModule} from '@docusaurus/types';

function dispatchLifecycleAction<K extends keyof ClientModule>(
  lifecycleAction: K,
  args: Parameters<NonNullable<ClientModule[K]>>,
) {
  clientModules.forEach((clientModule) => {
    const lifecycleFunction = (clientModule?.default?.[lifecycleAction] ??
      clientModule[lifecycleAction]) as
      | ((...a: Parameters<NonNullable<ClientModule[K]>>) => void)
      | undefined;

    lifecycleFunction?.(...args);
  });
}

const clientLifecyclesDispatchers: Required<ClientModule> = {
  onRouteUpdate(...args) {
    dispatchLifecycleAction('onRouteUpdate', args);
  },
  onRouteUpdateDelayed(...args) {
    dispatchLifecycleAction('onRouteUpdateDelayed', args);
  },
};

export default clientLifecyclesDispatchers;
