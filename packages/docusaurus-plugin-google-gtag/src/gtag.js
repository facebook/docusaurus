/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import siteConfig from '@generated/docusaurus.config';

export default (function() {
  if (typeof window === 'undefined') {
    return null;
  }

  const {
    themeConfig: {
      gtag: {trackingID},
      anonymizeIP: {anonymizeIP},
    },
  } = siteConfig;

  return {
    onRouteUpdate({location}) {
      // Always refer to the variable on window in-case it gets overridden elsewhere.
      window.gtag('config', trackingID, {
        page_path: location.pathname,
      });
      window.gtag('config', trackingID, {
        anonymize_ip: anonymizeIP,
      });
    },
  };
})();
