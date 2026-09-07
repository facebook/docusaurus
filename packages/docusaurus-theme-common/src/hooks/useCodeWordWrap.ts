/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type {RefObject} from 'react';
import {useState, useCallback, useEffect, useRef} from 'react';
import {useTabBecameVisibleCallback} from './useTabBecameVisibleCallback';

export type WordWrap = {
  readonly codeBlockRef: RefObject<HTMLPreElement | null>;
  readonly isEnabled: boolean;
  readonly isCodeScrollable: boolean;
  readonly toggle: () => void;
};

export function useCodeWordWrap(): WordWrap {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isCodeScrollable, setIsCodeScrollable] = useState<boolean>(false);
  const codeBlockRef = useRef<HTMLPreElement>(null);

  const toggle = useCallback(() => {
    const codeElement = codeBlockRef.current!.querySelector('code')!;

    if (isEnabled) {
      codeElement.removeAttribute('style');
    } else {
      codeElement.style.whiteSpace = 'pre-wrap';
      // When code wrap is enabled, we want to avoid a scrollbar in any case
      // Ensure that very very long words/strings/tokens still wrap
      codeElement.style.overflowWrap = 'anywhere';
    }

    setIsEnabled((value) => !value);
  }, [codeBlockRef, isEnabled]);

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

  return {codeBlockRef, isEnabled, isCodeScrollable, toggle};
}
