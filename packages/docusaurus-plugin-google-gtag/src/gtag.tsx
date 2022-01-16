/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import CookieConsent from '@theme/CookieConsent';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import globalData from '@generated/globalData';
import type {PluginOptions} from '@docusaurus/plugin-google-gtag';

declare global {
  interface Window {
    'ga-disable-MEASUREMENT_ID': boolean;
  }
}

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  window.onload = () => {
    const cookieConsentResponse = JSON.parse(
      localStorage.getItem('docusaurus.cookieConsent') ?? 'null',
    ) as boolean | null;
    if (cookieConsentResponse === null) {
      const consentBannerContainer = document.createElement('div');
      document
        .getElementById('__docusaurus')!
        .appendChild(consentBannerContainer);
      ReactDOM.render(<CookieConsent />, consentBannerContainer);
    }
  };

  const {trackingID} = globalData['docusaurus-plugin-google-gtag']
    .default as PluginOptions;

  return {
    onRouteUpdate({location}: {location: Location}) {
      // Always get the latest value on every route transition
      const cookieConsentResponse = JSON.parse(
        localStorage.getItem('docusaurus.cookieConsent') ?? 'null',
      ) as boolean | null;
      if (!cookieConsentResponse) {
        window['ga-disable-MEASUREMENT_ID'] = true;
        return;
      }
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
