/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

(() => {
  if (typeof window === 'undefined') {
    return;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    if ('serviceWorker' in navigator) {
      const {Workbox} = await import('workbox-window');

      const wb = new Workbox(process.env.SERVICE_WORKER);

      if (process.env.PWA_POPUP) {
        const {default: renderPopup} = await import('./renderPopup');

        wb.addEventListener('waiting', () => {
          renderPopup({
            onRefresh() {
              wb.addEventListener('controlling', () => {
                window.location.reload();
              });

              wb.messageSW({type: 'SKIP_WAITING'});
            },
          });
        });
      }

      wb.register();
    }
  });
})();
