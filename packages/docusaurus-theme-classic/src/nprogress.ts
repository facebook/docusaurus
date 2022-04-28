/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import nprogress from 'nprogress';
import './nprogress.css';
import type {Location} from 'history';

nprogress.configure({showSpinner: false});

const delay = 200;

export function onRouteUpdate({
  location,
  previousLocation,
}: {
  location: Location;
  previousLocation: Location | null;
}): (() => void) | undefined {
  if (location.pathname !== previousLocation?.pathname) {
    const progressBarTimeout = window.setTimeout(() => {
      nprogress.start();
    }, delay);
    return () => window.clearTimeout(progressBarTimeout);
  }
  return undefined;
}

export function onRouteDidUpdate(): void {
  nprogress.done();
}
