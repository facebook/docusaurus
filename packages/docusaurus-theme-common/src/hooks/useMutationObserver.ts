/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useEffect} from 'react';
import {useEvent, useShallowMemoObject} from '../utils/reactUtils';

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

  // MutationObserver options are not nested much
  // so this should be to memo options in 99%
  // TODO handle options.attributeFilter array
  const stableOptions: Options = useShallowMemoObject(options);

  useEffect(() => {
    const observer = new MutationObserver(stableCallback);
    if (target) {
      observer.observe(target, stableOptions);
    }
    return () => observer.disconnect();
  }, [target, stableCallback, stableOptions]);
}
