/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect} from 'react';
import {useHistory} from '@docusaurus/router';
import {useEvent} from './reactUtils';
import type {Location, Action} from 'history';

type HistoryBlockHandler = (location: Location, action: Action) => void | false;

/**
 * Permits to register a handler that will be called on history actions (pop,
 * push, replace). If the handler returns `false`, the navigation transition
 * will be blocked/cancelled.
 */
function useHistoryActionHandler(handler: HistoryBlockHandler): void {
  const history = useHistory();
  const stableHandler = useEvent(handler);
  useEffect(
    // See https://github.com/remix-run/history/blob/main/docs/blocking-transitions.md
    () => history.block((location, action) => stableHandler(location, action)),
    [history, stableHandler],
  );
}

/**
 * Permits to register a handler that will be called on history pop navigation
 * (backward/forward). If the handler returns `false`, the backward/forward
 * transition will be blocked. Unfortunately there's no good way to detect the
 * "direction" (backward/forward) of the POP event.
 */
export function useHistoryPopHandler(handler: HistoryBlockHandler): void {
  useHistoryActionHandler((location, action) => {
    if (action === 'POP') {
      // Maybe block navigation if handler returns false
      return handler(location, action);
    }
    // Don't block other navigation actions
    return undefined;
  });
}
