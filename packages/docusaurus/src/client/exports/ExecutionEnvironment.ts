/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const ExecutionEnvironment = {
  canUseDOM,

  canUseEventListeners:
    // @ts-expect-error: window.attachEvent is IE specific.
    // See https://github.com/Microsoft/TypeScript/issues/3953#issuecomment-123396830
    canUseDOM && !!(window.addEventListener || window.attachEvent),

  canUseIntersectionObserver: canUseDOM && 'IntersectionObserver' in window,

  canUseViewport: canUseDOM && !!window.screen,
};

export default ExecutionEnvironment;
