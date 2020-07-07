/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// First: read the env variables (provided by Webpack)
const {
  PWA_SERVICE_WORKER_URL,
  PWA_RELOAD_POPUP,
  PWA_OFFLINE_MODE_ACTIVATION_STRATEGIES,
  PWA_DEBUG,
} = process.env;

const debug = PWA_DEBUG; // shortcut

async function clearRegistrations() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  if (debug && registrations.length > 0) {
    console.log(`Docusaurus PWA: unregister service workers`, registrations);
  }
  registrations.forEach((registration) => {
    registration.registration.unregister();
  });
  window.location.reload();
}

const MAX_MOBILE_WIDTH = 940;
const APP_INSTALLED_KEY = 'docusaurus.pwa.appInstalled';

const OfflineModeActivationStrategiesImplementations = {
  always: () => true,
  mobile: () => window.innerWidth <= MAX_MOBILE_WIDTH,
  saveData: () => !!(navigator.connection && navigator.connection.saveData),
  appInstalled: () => !!localStorage.getItem(APP_INSTALLED_KEY),
  queryString: () =>
    new URLSearchParams(window.location.search).get('offlineMode') === 'true',
};

function isOfflineModeEnabled() {
  if (debug) {
    console.log(
      `Docusaurus PWA: is offlineMode enabled? activation strategies =>`,
      PWA_OFFLINE_MODE_ACTIVATION_STRATEGIES,
    );
  }
  const activeStrategies = PWA_OFFLINE_MODE_ACTIVATION_STRATEGIES.filter(
    (strategyName) => {
      const strategyImpl =
        OfflineModeActivationStrategiesImplementations[strategyName];
      return strategyImpl();
    },
  );
  const enabled = activeStrategies.length > 0;
  if (debug) {
    if (enabled) {
      console.log(
        'Docusaurus PWA: offline mode enabled, because of strategies:',
        activeStrategies,
      );
    } else {
      console.log('Docusaurus PWA: offline mode disabled');
    }
  }
  return enabled;
}

function createServiceWorkerUrl(params) {
  const paramsQueryString = JSON.stringify(params);
  const url = `${PWA_SERVICE_WORKER_URL}?params=${encodeURIComponent(
    paramsQueryString,
  )}`;
  if (debug) {
    console.log(`Docusaurus PWA: service worker url`, {url, params});
  }
  return url;
}

(async () => {
  if (typeof window === 'undefined') {
    return;
  }

  if (debug) {
    console.log('Docusaurus PWA: debug mode enabled');
  }

  if ('serviceWorker' in navigator) {
    const {Workbox} = await import('workbox-window');

    const offlineMode = isOfflineModeEnabled();

    const url = createServiceWorkerUrl({offlineMode, debug});
    const wb = new Workbox(url);

    const registration = await wb.register();

    const sendSkipWaiting = () => wb.messageSW({type: 'SKIP_WAITING'});

    const handleServiceWorkerWaiting = async () => {
      // Immediately load new service worker when files aren't cached
      if (!offlineMode) {
        sendSkipWaiting();
      } else if (PWA_RELOAD_POPUP) {
        const renderReloadPopup = (await import('./renderReloadPopup')).default;
        renderReloadPopup({
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
    // This happens when the user doesn't click on `reload` in the popup.
    if (registration.waiting) {
      if (debug) {
        console.log('Docusaurus PWA: registration.waiting', registration);
      }
      handleServiceWorkerWaiting();
    }

    // Update the current service worker when the next one has finished
    // installing and transitions to waiting state.
    wb.addEventListener('waiting', (event) => {
      if (debug) {
        console.log('Docusaurus PWA: event waiting', event);
      }
      handleServiceWorkerWaiting();
    });

    // Update current service worker if the next one finishes installing and
    // moves to waiting state in another tab.
    wb.addEventListener('externalwaiting', (event) => {
      if (debug) {
        console.log('Docusaurus PWA: event externalwaiting', event);
      }
      handleServiceWorkerWaiting();
    });

    window.addEventListener('appinstalled', (event) => {
      if (debug) {
        console.log('Docusaurus PWA: event appinstalled', event);
      }
      localStorage.setItem(APP_INSTALLED_KEY, true);

      // After the app is installed, we register a service worker with the path
      // `/sw?enabled`. Since the previous service worker was `/sw`, it'll be
      // treated as a new one. The previous registration will need to be
      // cleared, otherwise the reload popup will show.
      clearRegistrations();
    });

    window.addEventListener('beforeinstallprompt', (event) => {
      if (debug) {
        console.log('Docusaurus PWA: event appinstalled', event);
      }
      // TODO instead of default browser install UI, show custom docusaurus prompt?
      // event.preventDefault();

      if (localStorage.getItem(APP_INSTALLED_KEY)) {
        localStorage.removeItem(APP_INSTALLED_KEY);

        // After uninstalling the app, if the user doesn't clear all data, then
        // the previous service worker will continue serving cached files. We
        // need to clear registrations and reload, otherwise the popup will show.
        clearRegistrations();
      }
    });
  } else if (debug) {
    console.log('Docusaurus PWA: browser does not support service workers');
  }
})();
