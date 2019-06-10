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
    // process.env.NODE_ENV !== 'production' || // TODO: Add it back after testing that it works.
    !trackingID ||
    typeof window === 'undefined'
  ) {
    return null;
  }

  const $scriptEl = window.document.createElement('script');
  $scriptEl.async = 1;
  $scriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${trackingID}`;
  window.document.head.appendChild($scriptEl);

  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line no-inner-declarations
  function gtag(...args) {
    window.dataLayer.push(args);
  }
  // Expose globally.
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', trackingID);

  return {
    onRouteUpdate({location}) {
      // Always refer to the variable on window in-case it gets overridden elsewhere.
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
      });
    },
  };
})();
