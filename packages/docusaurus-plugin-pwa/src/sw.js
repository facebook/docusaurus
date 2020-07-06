/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable no-restricted-globals */

import {PrecacheController} from 'workbox-precaching';

async function runSWCustomCode() {
  if (process.env.SW_CUSTOM) {
    const customSW = await import(process.env.SW_CUSTOM);
    if (typeof customSW.default === 'function') {
      customSW.default();
    }
  }
}

/**
 * Gets different possible variations for a request URL. Similar to
 * https://git.io/JvixK
 *
 * @param {String} url
 */
function getPossibleURLs(url) {
  const possibleURLs = [];
  const urlObject = new URL(url, self.location.href);

  if (urlObject.origin !== self.location.origin) {
    return possibleURLs;
  }

  // Ignore search params and hash
  urlObject.search = '';
  urlObject.hash = '';
  possibleURLs.push(urlObject.href);

  // /blog/ => /blog/index.html
  if (urlObject.pathname.endsWith('/')) {
    possibleURLs.push(`${urlObject.href}index.html`);
  } else {
    // /blog => /blog/index.html
    possibleURLs.push(`${urlObject.href}/index.html`);
  }

  return possibleURLs;
}

(async () => {
  const precacheManifest = self.__WB_MANIFEST;
  const controller = new PrecacheController();
  const isEnabled = self.location.search.includes('enabled');

  if (isEnabled) {
    controller.addToCacheList(precacheManifest);
    await runSWCustomCode();
  }

  self.addEventListener('install', (event) => {
    event.waitUntil(controller.install());
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(controller.activate());
  });

  self.addEventListener('fetch', async (event) => {
    if (isEnabled) {
      const possibleURLs = getPossibleURLs(event.request.url);
      for (let i = 0; i < possibleURLs.length; i += 1) {
        const cacheKey = controller.getCacheKeyForURL(possibleURLs[i]);
        if (cacheKey) {
          event.respondWith(caches.match(cacheKey));
          break;
        }
      }
    }
  });

  self.addEventListener('message', async (event) => {
    const type = event.data && event.data.type;

    if (type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
})();
