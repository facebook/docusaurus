/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useRef} from 'react';
import {useHistory} from '@docusaurus/router';
import type {Location} from '@docusaurus/history';

/*
Permits to register a handler that will be called when a backward/forward navigation is detected
If the handler returns false, the backward/forward transition will be blocked

Limitations:
- can't detect backward/forward direction
- only handles navigation to direct backward/forward "sibling". history.go(-2) won't trigger the handler.

Unfortunately there's no good way to detect the direction of the history POP event.
This code is a best effort to make it possible to handle Android back-button,

Only use this when it's not a big deal to handle backward/forward navigations in a similar way (like closing menus/sidebars/drawers)
 */
export function useHistoryBackwardForwardHandler(
  handler: () => void | false,
): void {
  const {location, block} = useHistory();

  // Avoid stale closure issues without triggering useless re-renders
  const lastHandlerRef = useRef(handler);
  useEffect(() => {
    lastHandlerRef.current = handler;
  }, [handler]);

  // Unfortunately there's no easy way to detect a backward/forward navigation
  // We only track the last 2 locations because it's enough to detect a back navigation
  const last2LocationsRef = useRef<[Location, Location | undefined]>([
    location,
    undefined,
  ]);

  useEffect(() => {
    last2LocationsRef.current = [location, last2LocationsRef.current[0]];
  }, [location]);

  useEffect(() => {
    // See https://github.com/remix-run/history/blob/main/docs/blocking-transitions.md
    return block((newLocation, action) => {
      const previousLocation = last2LocationsRef.current[1];
      const isBackNavigation =
        action === 'POP' &&
        newLocation.key &&
        newLocation.key === previousLocation?.key;

      if (isBackNavigation) {
        // Block backward/forward navigation if handler returns false
        return lastHandlerRef.current();
      }
      // Don't block other navigation events
      return undefined;
    });
  }, [block, lastHandlerRef]);
}
