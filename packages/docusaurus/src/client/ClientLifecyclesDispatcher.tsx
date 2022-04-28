/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useImperativeHandle,
  useLayoutEffect,
  type ReactNode,
} from 'react';
import clientModules from '@generated/client-modules';
import type {ClientModule} from '@docusaurus/types';
import type {Location} from 'history';

function dispatchLifecycleAction<K extends keyof ClientModule>(
  lifecycleAction: K,
  ...args: Parameters<NonNullable<ClientModule[K]>>
) {
  clientModules.forEach((clientModule) => {
    const lifecycleFunction = (clientModule?.default?.[lifecycleAction] ??
      clientModule[lifecycleAction]) as
      | ((...a: Parameters<NonNullable<ClientModule[K]>>) => void)
      | undefined;

    lifecycleFunction?.(...args);
  });
}

function ClientLifecyclesDispatcher(
  {
    children,
    location,
    previousLocation,
  }: {
    children: ReactNode;
    location: Location;
    previousLocation: Location | null;
  },
  ref: React.ForwardedRef<ClientModule>,
): JSX.Element {
  useLayoutEffect(() => {
    if (previousLocation !== location) {
      const {hash} = location;
      if (!hash) {
        window.scrollTo(0, 0);
      } else {
        const id = decodeURIComponent(hash.substring(1));
        const element = document.getElementById(id);
        element?.scrollIntoView();
      }
      dispatchLifecycleAction('onRouteUpdate', {previousLocation, location});
    }
  }, [previousLocation, location]);
  useImperativeHandle(ref, () => ({
    onRouteUpdateDelayed: () =>
      dispatchLifecycleAction('onRouteUpdateDelayed', {location}),
  }));
  return <>{children}</>;
}

export default React.forwardRef(ClientLifecyclesDispatcher);
