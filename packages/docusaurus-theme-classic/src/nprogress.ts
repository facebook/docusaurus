/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import nprogress from 'nprogress';
import type {ClientModule} from '@docusaurus/types';
import {debounce} from 'lodash';

import './nprogress.css';

nprogress.configure({showSpinner: false});

const delay = 200;

const clientModule: ClientModule = {
  onRouteUpdate({location, previousLocation}) {
    if (previousLocation && location.pathname !== previousLocation.pathname) {
      const progressBarTimeout = debounce(() => {
        nprogress.start();
      }, delay);
      return () => progressBarTimeout.cancel();
    }
    return undefined;
  },
  onRouteDidUpdate() {
    nprogress.done();
  },
};

export default clientModule;
