/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import siteConfig from '@generated/docusaurus.config';

const {themeConfig} = siteConfig;

export default (function() {
  if (!themeConfig.gtag) {
    return null;
  }

  const {trackingID} = themeConfig.gtag;
  if (process.env.NODE_ENV === 'development' && !trackingID) {
    console.warn(
      'You specified the `gtag` object in `themeConfig` but the `trackingID` field was missing. ' +
        'Please ensure this is not a mistake.',
    );
    return null;
  }

  if (
    process.env.NODE_ENV !== 'production' ||
    !trackingID ||
    typeof window === 'undefined'
  ) {
    return null;
  }

  /* eslint-disable */
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    // Have to use `arguments` instead of spreading as there are
    // other properties attached to it e.g. callee.
    // The GA library requires usage of `arguments.
    window.dataLayer.push(arguments);
  }
  // Expose globally.
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', trackingID);
  /* eslint-enable */

  return {
    onRouteUpdate({location}) {
      // Always refer to the variable on window in-case it gets overridden elsewhere.
      window.gtag('config', trackingID, {
        page_path: location.pathname,
      });
    },
  };
})();
