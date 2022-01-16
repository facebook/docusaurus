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

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  const cookieConsentResponse = JSON.parse(
    localStorage.getItem('docusaurus.cookieConsent') ?? 'null',
  ) as boolean | null;
  window.onload = () => {
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

  if (!cookieConsentResponse) {
    return {};
  }

  return {
    onRouteUpdate({location}: {location: Location}) {
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
