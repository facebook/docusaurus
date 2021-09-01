/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useRef} from 'react';
import {useHistory} from '@docusaurus/router';
import type {Location, Action} from '@docusaurus/history';

type HistoryBlockHandler = (location: Location, action: Action) => void | false;

export function useHistoryBlock(handler: HistoryBlockHandler): void {
  const {block} = useHistory();

  // Avoid stale closure issues without triggering useless re-renders
  const lastHandlerRef = useRef(handler);
  useEffect(() => {
    lastHandlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    // See https://github.com/remix-run/history/blob/main/docs/blocking-transitions.md
    return block((location, action) => {
      return lastHandlerRef.current(location, action);
    });
  }, [block, lastHandlerRef]);
}

/*
Permits to register a handler that will be called on history pop navigation (backward/forward)
If the handler returns false, the backward/forward transition will be blocked

Unfortunately there's no good way to detect the "direction" (backward/forward) of the POP event.

Only use this when it's not a big deal to handle backward/forward navigations in a similar way (like closing menus/sidebars/drawers)
This code is a best effort to make it possible to handle Android back-button
 */
export function useHistoryBlockPop(handler: HistoryBlockHandler): void {
  useHistoryBlock((location, action) => {
    if (action === 'POP') {
      // Block navigation if handler returns false
      return handler(location, action);
    }
    // Don't block other navigation actions
    return undefined;
  });
}
