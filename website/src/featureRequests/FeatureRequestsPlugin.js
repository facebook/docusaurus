/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** @type {import('@docusaurus/types').Plugin} */
function FeatureRequestsPlugin() {
  return {
    name: 'feature-requests-plugin',
    contentLoaded({actions}) {
      actions.addRoute({
        path: '/feature-requests',
        exact: false,
        component: '@site/src/featureRequests/FeatureRequestsPage',
      });
    },
  };
}

module.exports = FeatureRequestsPlugin;
