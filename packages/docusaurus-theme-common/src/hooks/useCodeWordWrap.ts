/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type {RefObject} from 'react';
import {useState, useCallback, useEffect, useRef} from 'react';
import {useDynamicCallback} from '../utils/reactUtils';
import {useMutationObserver} from './useMutationObserver';

function useHiddenAttributeMutationObserver(
  target: Element | undefined | null,
  callback: () => void,
) {
  const hiddenAttributeCallback = useDynamicCallback(
    (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'hidden'
        ) {
          callback();
        }
      });
    },
  );

  useMutationObserver(target, hiddenAttributeCallback, {
    attributes: true,
    characterData: false,
    childList: false,
    subtree: false,
  });
}

export function useCodeWordWrap(): {
  readonly codeBlockRef: RefObject<HTMLPreElement>;
  readonly isEnabled: boolean;
  readonly isCodeScrollable: boolean;
  readonly toggle: () => void;
} {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isCodeScrollable, setIsCodeScrollable] = useState<boolean>(false);
  const [ancestor, setAncestor] = useState<Element | null | undefined>();
  const codeBlockRef = useRef<HTMLPreElement>(null);

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
    setAncestor(codeBlockRef.current?.closest('[hidden]'));
    const isScrollable =
      scrollWidth > clientWidth ||
      codeBlockRef.current!.querySelector('code')!.hasAttribute('style');
    setIsCodeScrollable(isScrollable);
  }, [codeBlockRef]);

  useHiddenAttributeMutationObserver(ancestor, updateCodeIsScrollable);

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
