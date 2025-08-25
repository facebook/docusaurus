/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ClientModule} from '@docusaurus/types';

// Check if Google Analytics is available and ready to use
function isGoogleAnalyticsReady(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.gtag === 'function' &&
    Array.isArray(window.dataLayer)
  );
}

const clientModule: ClientModule = {
  onRouteDidUpdate({location, previousLocation}) {
    if (
      previousLocation &&
      (location.pathname !== previousLocation.pathname ||
        location.search !== previousLocation.search ||
        location.hash !== previousLocation.hash)
    ) {
      // Only send events if GA is available
      if (!isGoogleAnalyticsReady()) {
        return;
      }

      // Normally, the document title is updated in the next tick due to how
      // `react-helmet-async` updates it. We want to send the current document's
      // title to gtag instead of the old one's, so we use `setTimeout` to defer
      // execution to the next tick.
      // See: https://github.com/facebook/docusaurus/issues/7420
      setTimeout(() => {
        // Always refer to the variable on window in case it gets overridden
        // elsewhere.
        window.gtag(
          'set',
          'page_path',
          location.pathname + location.search + location.hash,
        );
        window.gtag('event', 'page_view');
      });
    }
  },
};

export default clientModule;
