/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback, useEffect, useSyncExternalStore} from 'react';
import {useHistory} from '@docusaurus/router';
import {useEvent} from './reactUtils';

import type {History, Location, Action} from 'history';

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

/**
 * Permits to efficiently subscribe to a slice of the history
 * See https://thisweekinreact.com/articles/useSyncExternalStore-the-underrated-react-api
 * @param selector
 */
export function useHistorySelector<Value>(
  selector: (history: History<unknown>) => Value,
): Value {
  const history = useHistory();
  return useSyncExternalStore(
    history.listen,
    () => selector(history),
    () => selector(history),
  );
}

/**
 * Permits to efficiently subscribe to a specific querystring value
 * @param key
 */
export function useQueryStringValue(key: string | null): string | null {
  return useHistorySelector((history) => {
    if (key === null) {
      return null;
    }
    return new URLSearchParams(history.location.search).get(key);
  });
}

export function useQueryStringKeySetter(): (
  key: string,
  newValue: string | null,
  options?: {push: boolean},
) => void {
  const history = useHistory();
  return useCallback(
    (key, newValue, options) => {
      const searchParams = new URLSearchParams(history.location.search);
      if (newValue) {
        searchParams.set(key, newValue);
      } else {
        searchParams.delete(key);
      }
      const updaterFn = options?.push ? history.push : history.replace;
      updaterFn({
        search: searchParams.toString(),
      });
    },
    [history],
  );
}

export function useQueryString(
  key: string,
): [string, (newValue: string, options?: {push: boolean}) => void] {
  const value = useQueryStringValue(key) ?? '';
  const setQueryString = useQueryStringKeySetter();
  return [
    value,
    useCallback(
      (newValue: string, options) => {
        setQueryString(key, newValue, options);
      },
      [setQueryString, key],
    ),
  ];
}
