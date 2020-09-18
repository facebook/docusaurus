/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect} from 'react';

function useLockBodyScroll(lock: boolean = true): void {
  useEffect(() => {
    document.body.style.overflow = lock ? 'hidden' : 'visible';

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [lock]);
}

export default useLockBodyScroll;
