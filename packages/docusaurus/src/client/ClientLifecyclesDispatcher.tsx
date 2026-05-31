/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReactElement, ReactNode} from 'react';
import clientModules from '@generated/client-modules';
import useIsomorphicLayoutEffect from './exports/useIsomorphicLayoutEffect';
import type {ClientModule} from '@docusaurus/types';
import type {Location} from 'history';

export function dispatchLifecycleAction<K extends keyof ClientModule>(
  lifecycleAction: K,
  ...args: Parameters<NonNullable<ClientModule[K]>>
): () => void {
  const callbacks = clientModules.map((clientModule) => {
    const lifecycleFunction = (clientModule.default?.[lifecycleAction] ??
      clientModule[lifecycleAction]) as
      | ((
          ...a: Parameters<NonNullable<ClientModule[K]>>
        ) => (() => void) | void)
      | undefined;

    return lifecycleFunction?.(...args);
  });
  return () => callbacks.forEach((cb) => cb?.());
}

const MAX_SCROLL_FRAME_RETRIES = 5;

// Scrolls to the element matching the hash id, retrying on subsequent animation
// frames if the element is not in the DOM yet (race on slow/async navigation).
// Returns a cleanup function that cancels any pending retry.
function scrollToHashElement(id: string): () => void {
  let rafId: number | null = null;

  const tryScroll = (remainingRetries: number) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
      return;
    }
    if (remainingRetries > 0) {
      rafId = requestAnimationFrame(() => tryScroll(remainingRetries - 1));
    }
  };

  tryScroll(MAX_SCROLL_FRAME_RETRIES);

  return () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  };
}

function scrollAfterNavigation({
  location,
  previousLocation,
}: {
  location: Location;
  previousLocation: Location | null;
}): (() => void) | undefined {
  if (!previousLocation) {
    return undefined; // no-op: use native browser feature
  }

  const samePathname = location.pathname === previousLocation.pathname;
  const sameHash = location.hash === previousLocation.hash;
  const sameSearch = location.search === previousLocation.search;

  // Query-string changes: do not scroll to top/hash
  if (samePathname && sameHash && !sameSearch) {
    return undefined;
  }

  const {hash} = location;
  if (!hash) {
    window.scrollTo(0, 0);
    return undefined;
  }

  let id: string;
  try {
    id = decodeURIComponent(hash.substring(1));
  } catch {
    // Malformed hash (e.g. "#%E0%A4%A"): can't decode, nothing to scroll to.
    return undefined;
  }

  return scrollToHashElement(id);
}

function ClientLifecyclesDispatcher({
  children,
  location,
  previousLocation,
}: {
  children: ReactElement;
  location: Location;
  previousLocation: Location | null;
}): ReactNode {
  useIsomorphicLayoutEffect(() => {
    if (previousLocation !== location) {
      const cancelScroll = scrollAfterNavigation({location, previousLocation});
      const cleanupLifecycle = dispatchLifecycleAction('onRouteDidUpdate', {
        previousLocation,
        location,
      });
      return () => {
        cancelScroll?.();
        cleanupLifecycle();
      };
    }
    return undefined;
  }, [previousLocation, location]);
  return children;
}

export default ClientLifecyclesDispatcher;
