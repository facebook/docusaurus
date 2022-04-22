/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {MutableRefObject} from 'react';
import {useState, useCallback, useEffect, useRef} from 'react';

export function useCodeWordWrap(): {
  readonly codeBlockRef: (node: HTMLPreElement | null) => void;
  readonly isEnabled: boolean;
  readonly isCodeScrollable: boolean;
  readonly toggle: () => void;
} {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isCodeScrollable, setIsCodeScrollable] = useState<boolean>(false);
  const codeBlock = useRef() as MutableRefObject<HTMLPreElement>;
  const codeBlockRef = useCallback((node: HTMLPreElement | null) => {
    if (node !== null) {
      codeBlock.current = node;
    }
  }, []);

  const toggle = useCallback(() => {
    const codeElement = codeBlock.current.querySelector('code')!;

    if (isEnabled) {
      codeElement.removeAttribute('style');
    } else {
      codeElement.style.whiteSpace = 'pre-wrap';
    }

    setIsEnabled((value) => !value);
  }, [codeBlock, isEnabled]);

  const updateCodeIsScrollable = useCallback(() => {
    const {scrollWidth, clientWidth} = codeBlock.current;
    const isScrollable =
      scrollWidth > clientWidth ||
      codeBlock.current.querySelector('code')!.hasAttribute('style');
    setIsCodeScrollable(isScrollable);
  }, [codeBlock]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {codeBlockRef, isEnabled, isCodeScrollable, toggle};
}
