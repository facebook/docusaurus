/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback} from 'react';

export function useGoogleAnalytics(): {
  sendEvent: (action: string, event: Gtag.EventParams) => void;
} {
  const sendEvent = useCallback((action: string, event: Gtag.EventParams) => {
    if (window.gtag) {
      window.gtag('event', action, event);
    }
  }, []);

  return {sendEvent};
}
