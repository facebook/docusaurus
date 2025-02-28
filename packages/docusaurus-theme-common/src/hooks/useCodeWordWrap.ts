/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type {CSSProperties, RefObject} from 'react';
import {useState, useCallback, useEffect, useRef} from 'react';
import {useStorageSlot} from '../index';
import {useMutationObserver} from './useMutationObserver';

// Callback fires when the "hidden" attribute of a tabpanel changes
// See https://github.com/facebook/docusaurus/pull/7485
function useTabBecameVisibleCallback(
  codeBlockRef: RefObject<HTMLPreElement>,
  callback: () => void,
) {
  const [hiddenTabElement, setHiddenTabElement] = useState<
    Element | null | undefined
  >();

  const updateHiddenTabElement = useCallback(() => {
    // No need to observe non-hidden tabs
    // + we want to force a re-render when a tab becomes visible
    setHiddenTabElement(
      codeBlockRef.current?.closest('[role=tabpanel][hidden]'),
    );
  }, [codeBlockRef, setHiddenTabElement]);

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

function useCodeWrapState() {
  const [value, storageSlot] = useStorageSlot('docusaurus.code.wordWrap');

  const toggle = useCallback(() => {
    const newValue = value === 'true' ? 'false' : 'true';
    storageSlot.set(newValue);
  }, [value, storageSlot]);

  return [value === 'true', toggle] as const;
}

export function useCodeWordWrap(): {
  readonly codeBlockRef: RefObject<HTMLPreElement>;
  readonly isEnabled: boolean;
  readonly isCodeScrollable: boolean;
  readonly toggle: () => void;
  readonly codeStyle: CSSProperties;
} {
  const [isEnabled, toggleWrap] = useCodeWrapState();
  const [isCodeScrollable, setIsCodeScrollable] = useState<boolean>(false);
  const codeBlockRef = useRef<HTMLPreElement>(null);
  const codeStyle: CSSProperties = isEnabled
    ? {whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'}
    : {};

  const toggle = useCallback(() => {
    toggleWrap();
  }, [toggleWrap]);

  const updateCodeIsScrollable = useCallback(() => {
    const {scrollWidth, clientWidth} = codeBlockRef.current!;
    const isScrollable =
      scrollWidth > clientWidth ||
      codeBlockRef.current!.querySelector('code')!.hasAttribute('style');
    setIsCodeScrollable(isScrollable);
  }, [codeBlockRef]);

  useTabBecameVisibleCallback(codeBlockRef, updateCodeIsScrollable);

  useEffect(() => {
    updateCodeIsScrollable();
  }, [isEnabled, updateCodeIsScrollable]);

  useEffect(() => {
    window.addEventListener('resize', updateCodeIsScrollable, {
      passive: true,
    });

    return () => {
      window.removeEventListener('resize', updateCodeIsScrollable);
    };
  }, [updateCodeIsScrollable]);

  return {codeBlockRef, isEnabled, isCodeScrollable, toggle, codeStyle};
}
