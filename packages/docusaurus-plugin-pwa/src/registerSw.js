/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

async function clearRegistrations() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  registrations.forEach((registration) => {
    registration.unregister();
  });

  window.location.reload();
}

const MAX_MOBILE_WIDTH = 940;
const APP_INSTALLED_KEY = 'docusaurus.pwa.appInstalled';

const isSmallWidth = () => window.innerWidth <= MAX_MOBILE_WIDTH;
const isSaveData = () =>
  !!(navigator.connection && navigator.connection.saveData);
const isAppInstalled = () => !!localStorage.getItem(APP_INSTALLED_KEY);
const isOfflineQueryString = () => window.location.search.includes('offline');
const isForcePrecaching = () => process.env.PWA_ALWAYS_PRECACHE === 'true';

const isCachingEnabled = () => {
  return (
    isSmallWidth() ||
    isSaveData() ||
    isAppInstalled() ||
    isOfflineQueryString() ||
    isForcePrecaching()
  );
};

(async () => {
  if (typeof window === 'undefined') {
    return;
  }

  if ('serviceWorker' in navigator) {
    const {Workbox} = await import('workbox-window');

    const cachingEnabled = isCachingEnabled();

    const enabledParam = cachingEnabled ? `?enabled` : '';
    const swUrl = `${process.env.PWA_SERVICE_WORKER}${enabledParam}`;
    const wb = new Workbox(swUrl);
    const registration = await wb.register();
    const sendSkipWaiting = () => wb.messageSW({type: 'SKIP_WAITING'});

    const handleServiceWorkerWaiting = async () => {
      // Immediately load new service worker when files aren't cached
      if (!cachingEnabled) {
        sendSkipWaiting();
      } else if (process.env.PWA_POPUP) {
        const renderPopup = (await import('./renderPopup')).default;

        renderPopup({
          onReload() {
            wb.addEventListener('controlling', () => {
              window.location.reload();
            });
            sendSkipWaiting();
          },
        });
      }
    };

    // Update service worker if the next one is already in the waiting state.
    // This happens when the user doesn't click on `reload` in the
    // popup.
    if (registration.waiting) {
      handleServiceWorkerWaiting();
    }

    // Update the current service worker when the next one has finished
    // installing and transitions to waiting state.
    wb.addEventListener('waiting', handleServiceWorkerWaiting);

    // Update current service worker if the next one finishes installing and
    // moves to waiting state in another tab.
    wb.addEventListener('externalwaiting', handleServiceWorkerWaiting);

    window.addEventListener('appinstalled', () => {
      localStorage.setItem(APP_INSTALLED_KEY, true);

      // After the app is installed, we register a service worker with the path
      // `/sw?enabled`. Since the previous service worker was `/sw`, it'll be
      // treated as a new one. The previous registration will need to be
      // cleared, otherwise the reload popup will show.
      clearRegistrations();
    });

    window.addEventListener('beforeinstallprompt', (_event) => {
      // event.preventDefault();
      // event.prompt();

      if (localStorage.getItem(APP_INSTALLED_KEY)) {
        localStorage.removeItem(APP_INSTALLED_KEY);

        // After uninstalling the app, if the user doesn't clear all data, then
        // the previous service worker will continue serving cached files. We
        // need to clear registrations and reload, otherwise the popup will show.
        clearRegistrations();
      }
    });
  }
})();
