/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ClientModule} from '@docusaurus/types';

const clientModule: ClientModule = {
  onRouteDidUpdate({location, previousLocation}) {
    if (
      previousLocation &&
      (location.pathname !== previousLocation.pathname ||
        location.search !== previousLocation.search ||
        location.hash !== previousLocation.hash)
    ) {
      // Set page so that subsequent hits on this page are attributed
      // to this page. This is recommended for Single-page Applications.
      window.ga(
        'set',
        'page',
        location.pathname + location.search + location.hash,
      );
      // Always refer to the variable on window in-case it gets
      // overridden elsewhere.
      window.ga('send', 'pageview');
    }
  },
};

export default clientModule;
