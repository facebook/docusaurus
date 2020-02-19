/**
 * Copyright (c) 2020-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

(() => {
  if (typeof window === 'undefined') {
    return;
  }

  if ('serviceWorker' in navigator) {
    console.log(`ServiceWorker: Registering ${process.env.SERVICE_WORKER}`);

    window.addEventListener('load', async () => {
      try {
        await navigator.serviceWorker.register(process.env.SERVICE_WORKER);
        console.log('ServiceWorker: Registered SW successfully');
      } catch {
        console.log('ServiceWorker: Failed to Register!');
      }
    });
  }
})();
