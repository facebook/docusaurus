/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import nprogress from 'nprogress';
import './nprogress.css';
import type {ClientModule} from '@docusaurus/types';

nprogress.configure({showSpinner: false});

const delay = 200;

const clientModule: ClientModule = {
  onRouteUpdate({location, previousLocation}) {
    if (previousLocation && location.pathname !== previousLocation.pathname) {
      const progressBarTimeout = window.setTimeout(() => {
        nprogress.start();
      }, delay);
      return () => window.clearTimeout(progressBarTimeout);
    }
    return undefined;
  },
  onRouteDidUpdate() {
    nprogress.done();
  },
};

export default clientModule;
