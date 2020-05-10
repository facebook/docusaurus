/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect} from 'react';

function useLockBodyScroll(lock = true) {
  useEffect(() => {
    document.body.style.overflow = lock ? 'hidden' : 'visible';

    return () => {
      document.body.style.overflow = 'visible';
      window.scrollTo(0, 0);
    };
  }, [lock]);
}

export default useLockBodyScroll;
