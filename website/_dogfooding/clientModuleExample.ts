/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function onRouteUpdate({location}: {location: Location}): void {
  // console.log('onRouteUpdate', {location});
}

if (ExecutionEnvironment.canUseDOM) {
  // console.log('client module example log');
}
