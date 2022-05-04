/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import globalData from '@generated/globalData';
import type {PluginOptions} from './options';
import type {ClientModule} from '@docusaurus/types';

const {trackingID} = globalData['docusaurus-plugin-google-gtag']!
  .default as PluginOptions;

const clientModule: ClientModule = {
  onRouteDidUpdate({location, previousLocation}) {
    if (previousLocation && location.pathname !== previousLocation.pathname) {
      // Always refer to the variable on window in case it gets overridden
      // elsewhere.
      window.gtag('config', trackingID, {
        page_path: location.pathname,
        page_title: document.title,
      });
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      });
    }
  },
};

export default clientModule;
