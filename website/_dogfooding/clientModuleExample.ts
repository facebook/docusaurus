/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import type {Location} from 'history';

export function onRouteUpdate({
  location,
  previousLocation,
}: {
  location: Location;
  previousLocation: Location | null;
}): void {
  if (ExecutionEnvironment.canUseDOM) {
    console.log(`onRouteUpdate
Previous location: ${previousLocation?.pathname}
Current location: ${location.pathname}
Current heading: ${document.getElementsByTagName('h1')[0]?.innerText}`);
  }
}

export function onRouteUpdateDelayed({location}: {location: Location}): void {
  if (ExecutionEnvironment.canUseDOM) {
    console.log(`onRouteUpdateDelayed
Current location: ${location.pathname}
Current heading: ${document.getElementsByTagName('h1')[0]?.innerText}`);
  }
}
