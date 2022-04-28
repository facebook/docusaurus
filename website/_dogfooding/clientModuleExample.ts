/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import siteConfig from '@generated/docusaurus.config';
import type {Location} from 'history';

function logPage(
  event: string,
  location: Location,
  previousLocation: Location | null,
): void {
  console.log(`${event}
Previous location: ${previousLocation?.pathname}
Current location: ${location.pathname}
Current heading: ${document.getElementsByTagName('h1')[0]?.innerText}`);
}

export function onRouteUpdate({
  location,
  previousLocation,
}: {
  location: Location;
  previousLocation: Location | null;
}): (() => void) | void {
  if (
    process.env.NODE_ENV === 'development' ||
    siteConfig.customFields!.isDeployPreview
  ) {
    logPage('onRouteUpdate', location, previousLocation);
    return () => logPage('onRouteUpdate cleanup', location, previousLocation);
  }
  return undefined;
}

export function onRouteDidUpdate({
  location,
  previousLocation,
}: {
  location: Location;
  previousLocation: Location | null;
}): void {
  if (
    process.env.NODE_ENV === 'development' ||
    siteConfig.customFields!.isDeployPreview
  ) {
    logPage('onRouteDidUpdate', location, previousLocation);
  }
}
