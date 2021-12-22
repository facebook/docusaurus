/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useRef} from 'react';
import {useIsomorphicLayoutEffect} from './reactUtils';

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
