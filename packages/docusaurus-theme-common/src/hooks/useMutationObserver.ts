/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useEffect, useMemo} from 'react';
import {
  useEvent,
  useShallowMemoObject,
  useShallowMemoArray,
} from '../utils/reactUtils';

type Options = MutationObserverInit;

const DefaultOptions: Options = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};

export function useMutationObserver(
  target: Element | undefined | null,
  callback: MutationCallback,
  options: Options = DefaultOptions,
): void {
  const stableCallback = useEvent(callback);

  // Memoize attributeFilter array separately for proper deep comparison
  const stableAttributeFilter = useShallowMemoArray(options.attributeFilter);

  // Memoize remaining options (shallow comparison is fine for booleans)
  const {attributeFilter: _, ...restOptions} = options;
  const stableRestOptions = useShallowMemoObject(restOptions);

  // Combine memoized parts
  const stableOptions: Options = useMemo(
    () =>
      stableAttributeFilter
        ? {...stableRestOptions, attributeFilter: stableAttributeFilter}
        : stableRestOptions,
    [stableRestOptions, stableAttributeFilter],
  );

  useEffect(() => {
    const observer = new MutationObserver(stableCallback);
    if (target) {
      observer.observe(target, stableOptions);
    }
    return () => observer.disconnect();
  }, [target, stableCallback, stableOptions]);
}
