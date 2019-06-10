/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import siteConfig from '@generated/docusaurus.config';

const {themeConfig} = siteConfig;

export default (function() {
  if (!themeConfig.googleAnalytics) {
    return null;
  }

  const {trackingID} = themeConfig.googleAnalytics;
  if (process.env.NODE_ENV === 'development' && !trackingID) {
    console.warn(
      'You specified the `googleAnalytics` object in `themeConfig` but the `trackingID` field was missing. ' +
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
  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    (i[r] =
      i[r] ||
      function() {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(
    window,
    document,
    'script',
    'https://www.google-analytics.com/analytics.js',
    'ga',
  );
  /* eslint-enable */

  window.ga('create', trackingID, 'auto');
  window.ga('send', 'pageview');

  return {
    onRouteUpdate({location}) {
      // Set page so that subsequent hits on this page are attributed
      // to this page. This is recommended for Single-page Applications.
      window.ga('set', 'page', location.pathname);
      // Always refer to the variable on window in-case it gets overridden elsewhere.
      window.ga('send', 'pageview');
    },
  };
})();
