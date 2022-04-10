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
  previousLocation: Location;
}): void {
  if (ExecutionEnvironment.canUseDOM) {
    console.log(`onRouteUpdate (Fired before DOM repaints)
Previous location: ${previousLocation.pathname}
Current location: ${location.pathname}
Current heading: ${document.getElementsByTagName('h1')[0]?.innerText}`);
  }
}
export function onRouteDidUpdate({
  location,
  previousLocation,
}: {
  location: Location;
  previousLocation: Location;
}): void {
  if (ExecutionEnvironment.canUseDOM) {
    console.log(`onRouteDidUpdate (Fired after DOM repaints)
Previous location: ${previousLocation.pathname}
Current location: ${location.pathname}
Current heading: ${document.getElementsByTagName('h1')[0]?.innerText}`);
  }
}
