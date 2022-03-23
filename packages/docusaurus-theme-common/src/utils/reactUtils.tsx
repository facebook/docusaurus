/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback, useEffect, useLayoutEffect, useRef} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * This hook is like `useLayoutEffect`, but without the SSR warning.
 * It seems hacky but it's used in many React libs (Redux, Formik...).
 * Also mentioned here: https://github.com/facebook/react/issues/16956
 *
 * It is useful when you need to update a ref as soon as possible after a React
 * render (before `useEffect`).
 */
export const useIsomorphicLayoutEffect = ExecutionEnvironment.canUseDOM
  ? useLayoutEffect
  : useEffect;

/**
 * Permits to transform an unstable callback (like an arrow function provided as
 * props) to a "stable" callback that is safe to use in a `useEffect` dependency
 * array. Useful to avoid React stale closure problems + avoid useless effect
 * re-executions.
 *
 * Workaround until the React team recommends a good solution, see
 * https://github.com/facebook/react/issues/16956
 *
 * This generally works but has some potential drawbacks, such as
 * https://github.com/facebook/react/issues/16956#issuecomment-536636418
 */
export function useDynamicCallback<T extends (...args: never[]) => unknown>(
  callback: T,
): T {
  const ref = useRef<T>(callback);

  useIsomorphicLayoutEffect(() => {
    ref.current = callback;
  }, [callback]);

  // @ts-expect-error: TS is right that this callback may be a supertype of T,
  // but good enough for our use
  return useCallback<T>((...args) => ref.current(...args), []);
}

/**
 * Gets `value` from the last render.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

/**
 * This error is thrown when a context is consumed outside its provider. Allows
 * reusing a generic error message format and reduces bundle size. The hook's
 * name will be extracted from its stack, so only the provider's name is needed.
 */
export class ReactContextError extends Error {
  constructor(providerName: string, additionalInfo?: string) {
    super();
    this.name = 'ReactContextError';
    this.message = `Hook ${
      this.stack?.split('\n')[1]?.match(/at (?:\w+\.)?(?<name>\w+)/)?.groups!
        .name
    } is called outside the <${providerName}>. ${additionalInfo || ''}`;
  }
}
