/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {RefObject} from 'react';
import {useState, useCallback, useEffect, useRef} from 'react';

export function useCodeWordWrap(): {
  readonly codeBlockRef: RefObject<HTMLPreElement>;
  readonly isEnabled: boolean;
  readonly isCodeScrollable: boolean;
  readonly toggle: () => void;
} {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isCodeScrollable, setIsCodeScrollable] = useState<boolean>(false);
  const codeBlockRef = useRef<HTMLPreElement>(null);
  const [mutationObserver, setMutationObserver] =
    useState<MutationObserver | null>(null);

  const toggle = useCallback(() => {
    const codeElement = codeBlockRef.current!.querySelector('code')!;

    if (isEnabled) {
      codeElement.removeAttribute('style');
    } else {
      codeElement.style.whiteSpace = 'pre-wrap';
      codeElement.style.overflowWrap = 'anywhere';
    }

    setIsEnabled((value) => !value);
  }, [codeBlockRef, isEnabled]);

  const updateCodeIsScrollable = useCallback(() => {
    const {scrollWidth, clientWidth} = codeBlockRef.current!;
    // Allows code block to update scrollWidth and clientWidth after "hidden"
    // attribute is removed
    const hiddenAncestor = codeBlockRef.current?.closest('[hidden]');
    if (hiddenAncestor && mutationObserver) {
      mutationObserver.observe(hiddenAncestor, {
        attributes: true,
        attributeFilter: ['hidden'],
      });
    }
    const isScrollable =
      scrollWidth > clientWidth ||
      codeBlockRef.current!.querySelector('code')!.hasAttribute('style');
    setIsCodeScrollable(isScrollable);
  }, [codeBlockRef, mutationObserver]);

  useEffect(() => {
    updateCodeIsScrollable();
  }, [isEnabled, updateCodeIsScrollable]);

  useEffect(() => {
    window.addEventListener('resize', updateCodeIsScrollable, {
      passive: true,
    });

    if (!mutationObserver) {
      setMutationObserver(
        new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === 'attributes' &&
              mutation.attributeName === 'hidden'
            ) {
              updateCodeIsScrollable();
            }
          });
        }),
      );
    }

    return () => {
      window.removeEventListener('resize', updateCodeIsScrollable);
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    };
  }, [updateCodeIsScrollable, mutationObserver]);

  return {codeBlockRef, isEnabled, isCodeScrollable, toggle};
}
