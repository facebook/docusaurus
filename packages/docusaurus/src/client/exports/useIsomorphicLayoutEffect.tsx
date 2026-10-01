/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useLayoutEffect} from 'react';

/**
 * This hook is now just React's `useLayoutEffect`.
 *
 * It used to fall back to `useEffect` on the server to avoid the
 * `useLayoutEffect` SSR warning, which React 19 removed.
 * See https://github.com/facebook/react/pull/26395
 *
 * It is unnecessary since React 19: use `useLayoutEffect` directly.
 * We only keep it for retro-compatibility, because third-party code might
 * import `@docusaurus/useIsomorphicLayoutEffect`.
 */
const useIsomorphicLayoutEffect = useLayoutEffect;

export default useIsomorphicLayoutEffect;
