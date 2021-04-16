/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {createStorageSlot} from '@docusaurus/theme-common';

// First: read the env variables (provided by Webpack)
/* eslint-disable prefer-destructuring */
const PWA_SERVICE_WORKER_URL = process.env.PWA_SERVICE_WORKER_URL;
const PWA_RELOAD_POPUP = process.env.PWA_RELOAD_POPUP;
const PWA_OFFLINE_MODE_ACTIVATION_STRATEGIES =
  process.env.PWA_OFFLINE_MODE_ACTIVATION_STRATEGIES;
const PWA_DEBUG = process.env.PWA_DEBUG;
/* eslint-enable prefer-destructuring */

const debug = PWA_DEBUG; // shortcut

const MAX_MOBILE_WIDTH = 940;

const AppInstalledEventFiredStorage = createStorageSlot(
  'docusaurus.pwa.event.appInstalled.fired',
);

async function clearRegistrations() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  if (debug) {
    console.log(
      `[Docusaurus-PWA][registerSw]: will unregister all service worker registrations`,
      registrations,
    );
  }
  await Promise.all(
    registrations.map(async (registration) => {
      const result = await registration?.registration?.unregister();
      if (debug) {
        console.log(
          `[Docusaurus-PWA][registerSw]: unregister() service worker registration`,
          registrations,
          result,
        );
      }
    }),
  );
  if (debug) {
    console.log(
      `[Docusaurus-PWA][registerSw]: unregistered all service worker registrations`,
      registrations,
    );
  }
  window.location.reload();
}

/*
As of 2021:
It is complicated and not very reliable to detect an app is actually installed.
https://stackoverflow.com/questions/51735869/check-if-user-has-already-installed-pwa-to-homescreen-on-chrome

- appinstalled event is not in the spec anymore and seems to not fire? https://firt.dev/pwa-2021#less-capabilities-%E2%98%B9%EF%B8%8F
- getInstalledRelatedApps() is only supported in recent Chrome and does not seem to reliable either https://github.com/WICG/get-installed-related-apps
- display-mode: standalone is not exactly the same concept, but looks like a decent fallback https://petelepage.com/blog/2019/07/is-my-pwa-installed/
 */
async function isAppInstalledEventFired() {
  return AppInstalledEventFiredStorage.get() === 'true';
}
async function isAppInstalledRelatedApps() {
  if ('getInstalledRelatedApps' in window.navigator) {
    const relatedApps = await navigator.getInstalledRelatedApps();
    return relatedApps.some((app) => app.platform === 'webapp');
  }
  return false;
}
function isStandaloneDisplayMode() {
  return window.matchMedia('(display-mode: standalone)').matches;
}

const OfflineModeActivationStrategiesImplementations = {
  always: () => true,
  mobile: () => window.innerWidth <= MAX_MOBILE_WIDTH,
  saveData: () => !!(navigator.connection && navigator.connection.saveData),
  appInstalled: async () => {
    const installedEventFired = await isAppInstalledEventFired();
    const installedRelatedApps = await isAppInstalledRelatedApps();
    return installedEventFired || installedRelatedApps;
  },
  standalone: () => isStandaloneDisplayMode(),
  queryString: () =>
    new URLSearchParams(window.location.search).get('offlineMode') === 'true',
};

async function isStrategyActive(strategyName) {
  return OfflineModeActivationStrategiesImplementations[strategyName]();
}

async function getActiveStrategies() {
  const activeStrategies = await Promise.all(
    PWA_OFFLINE_MODE_ACTIVATION_STRATEGIES.map(async (strategyName) => {
      const isActive = await isStrategyActive(strategyName);
      return isActive ? strategyName : undefined;
    }),
  );
  return activeStrategies.filter(Boolean); // remove undefined values
}

async function isOfflineModeEnabled() {
  const activeStrategies = await getActiveStrategies();
  const enabled = activeStrategies.length > 0;
  if (debug) {
    const logObject = {
      activeStrategies,
      availableStrategies: PWA_OFFLINE_MODE_ACTIVATION_STRATEGIES,
    };
    if (enabled) {
      console.log(
        '[Docusaurus-PWA][registerSw]: offline mode enabled, because of activation strategies',
        logObject,
      );
    } else {
      console.log(
        '[Docusaurus-PWA][registerSw]: offline mode disabled, because none of the offlineModeActivationStrategies could be used',
        logObject,
      );
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
    console.log(`[Docusaurus-PWA][registerSw]: service worker url`, {
      url,
      params,
    });
  }
  return url;
}

async function registerSW() {
  const {Workbox} = await import('workbox-window');

  const offlineMode = await isOfflineModeEnabled();

  const url = createServiceWorkerUrl({offlineMode, debug});
  const wb = new Workbox(url);

  const registration = await wb.register();

  const sendSkipWaiting = () => wb.messageSW({type: 'SKIP_WAITING'});

  const handleServiceWorkerWaiting = async () => {
    if (debug) {
      console.log('[Docusaurus-PWA][registerSw]: handleServiceWorkerWaiting');
    }
    // Immediately load new service worker when files aren't cached
    if (!offlineMode) {
      sendSkipWaiting();
    } else if (PWA_RELOAD_POPUP) {
      const renderReloadPopup = (await import('./renderReloadPopup')).default;
      await renderReloadPopup({
        onReload() {
          wb.addEventListener('controlling', () => {
            window.location.reload();
          });
          sendSkipWaiting();
        },
      });
    }
  };

  if (debug) {
    if (registration.active) {
      console.log(
        '[Docusaurus-PWA][registerSw]: registration.active',
        registration,
      );
    }
    if (registration.installing) {
      console.log(
        '[Docusaurus-PWA][registerSw]: registration.installing',
        registration,
      );
    }
    if (registration.waiting) {
      console.log(
        '[Docusaurus-PWA][registerSw]: registration.waiting',
        registration,
      );
    }
  }

  // Update the current service worker when the next one has finished
  // installing and transitions to waiting state.
  wb.addEventListener('waiting', (event) => {
    if (debug) {
      console.log('[Docusaurus-PWA][registerSw]: event waiting', event);
    }
    handleServiceWorkerWaiting();
  });

  // Update current service worker if the next one finishes installing and
  // moves to waiting state in another tab.
  wb.addEventListener('externalwaiting', (event) => {
    if (debug) {
      console.log('[Docusaurus-PWA][registerSw]: event externalwaiting', event);
    }
    handleServiceWorkerWaiting();
  });

  // Update service worker if the next one is already in the waiting state.
  // This happens when the user doesn't click on `reload` in the popup.
  if (registration.waiting) {
    await handleServiceWorkerWaiting();
  }
}

// TODO these events still works in chrome but have been removed from the spec in 2019!
// See https://github.com/w3c/manifest/pull/836
function addLegacyAppInstalledEventsListeners() {
  if (typeof window !== 'undefined') {
    if (debug) {
      console.log(
        '[Docusaurus-PWA][registerSw]: addLegacyAppInstalledEventsListeners',
      );
    }

    window.addEventListener('appinstalled', async (event) => {
      if (debug) {
        console.log('[Docusaurus-PWA][registerSw]: event appinstalled', event);
      }

      AppInstalledEventFiredStorage.set('true');
      if (debug) {
        console.log(
          "[Docusaurus-PWA][registerSw]: AppInstalledEventFiredStorage.set('true')",
        );
      }

      // After the app is installed, we register a service worker with the path
      // `/sw?enabled`. Since the previous service worker was `/sw`, it'll be
      // treated as a new one. The previous registration will need to be
      // cleared, otherwise the reload popup will show.
      await clearRegistrations();
    });

    // TODO this event still works in chrome but has been removed from the spec in 2019!!!
    window.addEventListener('beforeinstallprompt', async (event) => {
      if (debug) {
        console.log(
          '[Docusaurus-PWA][registerSw]: event beforeinstallprompt',
          event,
        );
      }
      // TODO instead of default browser install UI, show custom docusaurus prompt?
      // event.preventDefault();
      if (debug) {
        console.log(
          '[Docusaurus-PWA][registerSw]: AppInstalledEventFiredStorage.get()',
          AppInstalledEventFiredStorage.get(),
        );
      }
      if (AppInstalledEventFiredStorage.get()) {
        AppInstalledEventFiredStorage.del();
        if (debug) {
          console.log(
            '[Docusaurus-PWA][registerSw]: AppInstalledEventFiredStorage.del()',
          );
        }
        // After uninstalling the app, if the user doesn't clear all data, then
        // the previous service worker will continue serving cached files. We
        // need to clear registrations and reload, otherwise the popup will show.
        await clearRegistrations();
      }
    });

    if (debug) {
      console.log(
        '[Docusaurus-PWA][registerSw]: legacy appinstalled and beforeinstallprompt event listeners installed',
      );
    }
  }
}

/*
Init code to run on the client!
 */
if (typeof window !== 'undefined') {
  if (debug) {
    console.log('[Docusaurus-PWA][registerSw]: debug mode enabled');
  }

  if ('serviceWorker' in navigator) {
    // First: add the listeners asap/synchronously
    addLegacyAppInstalledEventsListeners();

    // Then try to register the SW using lazy/dynamic imports
    registerSW().catch((e) => console.error('registerSW failed', e));
  }
}
