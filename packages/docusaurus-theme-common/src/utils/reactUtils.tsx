/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback, useEffect, useLayoutEffect, useRef} from 'react';

// This hook is like useLayoutEffect, but without the SSR warning
// It seems hacky but it's used in many React libs (Redux, Formik...)
// Also mentioned here: https://github.com/facebook/react/issues/16956
// It is useful when you need to update a ref as soon as possible after a React render (before useEffect)
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Permits to transform an unstable callback (like an arrow function provided as props)
// to a "stable" callback that is safe to use in a useEffect dependency array
// Useful to avoid React stale closure problems + avoid useless effect re-executions
//
// Workaround until the React team recommends a good solution, see https://github.com/facebook/react/issues/16956
// This generally works has some potential drawbacks, such as https://github.com/facebook/react/issues/16956#issuecomment-536636418
export function useDynamicCallback<T extends (...args: never[]) => unknown>(
  callback: T,
): T {
  const ref = useRef<T>(callback);

  useIsomorphicLayoutEffect(() => {
    ref.current = callback;
  }, [callback]);

  // @ts-expect-error: TODO, not sure how to fix this TS error
  return useCallback<T>((...args) => ref.current(...args), []);
}
