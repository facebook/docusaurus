/**
 * Copyright (c) Meta. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {normalizeUrl} = require('@docusaurus/utils');

/**
 * @param {import('@docusaurus/types').LoadContext} context
 * @returns {import('@docusaurus/types').Plugin}
 */
function FeatureRequestsPlugin(context) {
  return {
    name: 'feature-requests-plugin',
    async contentLoaded({actions}) {
      actions.addRoute({
        path: normalizeUrl([context.baseUrl, '/feature-requests']),
        exact: false,
        component: '@site/src/featureRequests/FeatureRequestsPage',
      });
    },
  };
}

module.exports = FeatureRequestsPlugin;
