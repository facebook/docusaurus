/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useEffect} from 'react';

export function useCodeWordWrap(codeBlockRef: React.RefObject<HTMLPreElement>) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isCodeScrollable, setIsCodeScrollable] = useState<boolean>(false);

  const toggle = useCallback(() => {
    const codeElement = codeBlockRef.current!.querySelector('code')!;

    if (isEnabled) {
      codeElement.removeAttribute('style');
    } else {
      codeElement.style.whiteSpace = 'pre-wrap';
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

  useEffect(() => {
    updateCodeIsScrollable();
  }, [isEnabled, updateCodeIsScrollable]);

  useEffect(() => {
    updateCodeIsScrollable();

    window.addEventListener('resize', updateCodeIsScrollable, {
      passive: true,
    });

    return () => {
      window.removeEventListener('resize', updateCodeIsScrollable);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {isEnabled, isCodeScrollable, toggle};
}
