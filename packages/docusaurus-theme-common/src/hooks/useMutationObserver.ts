/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useRef, useMemo, useEffect} from 'react';

export function useMutationObserver(
  target: Element | undefined | null,
  callback: (mutations: MutationRecord[]) => void,
  options = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  },
): void {
  const mutationObserver = useRef<MutationObserver>(
    new MutationObserver(callback),
  );
  const memoOptions = useMemo(() => options, [options]);

  useEffect(() => {
    const observer = mutationObserver.current;

    if (target) {
      observer.observe(target, memoOptions);
    }

    return () => observer.disconnect();
  }, [target, memoOptions]);
}
