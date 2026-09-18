/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {RefObject} from 'react';
import {useState, useCallback, useEffect} from 'react';
import {useMutationObserver} from './useMutationObserver';

// Callback fires when the "hidden" attribute of a tabpanel changes.
export function useTabBecameVisibleCallback(
  elementRef: RefObject<Element | null>,
  callback: () => void,
): void {
  const [hiddenTabElement, setHiddenTabElement] = useState<
    Element | null | undefined
  >();

  const updateHiddenTabElement = useCallback(() => {
    // No need to observe non-hidden tabs.
    // + we want to force a re-render when a tab becomes visible.
    setHiddenTabElement(
      elementRef.current?.closest('[role=tabpanel][hidden]'),
    );
  }, [elementRef, setHiddenTabElement]);

  useEffect(() => {
    updateHiddenTabElement();
  }, [updateHiddenTabElement]);

  useMutationObserver(
    hiddenTabElement,
    (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'hidden'
        ) {
          callback();
          updateHiddenTabElement();
        }
      });
    },
    {
      attributes: true,
      characterData: false,
      childList: false,
      subtree: false,
    },
  );
}
