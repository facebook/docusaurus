/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import siteConfig from '@generated/docusaurus.config';

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  const {
    themeConfig: {
      gtag: {trackingID},
    },
  } = siteConfig;

  return {
    onRouteUpdate({location}) {
      // Always refer to the variable on window in-case it gets overridden elsewhere.
      window.gtag('config', trackingID, {
        page_path: location.pathname,
        page_title: document.title,
      });
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: location.href,
        page_path: location.pathname,
      });
    },
  };
})();
