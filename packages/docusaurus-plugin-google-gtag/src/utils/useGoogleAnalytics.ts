/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback} from 'react';

export interface Event {
  action: string;
  event_category?: string;
  event_label?: string;
  value?: string;
}

export function useGoogleAnalytics(): {
  sendEvent: (event: Event) => void;
} {
  const sendEvent = useCallback((event: Event) => {
    window.gtag('event', event.action, event);
  }, []);

  return {sendEvent};
}
