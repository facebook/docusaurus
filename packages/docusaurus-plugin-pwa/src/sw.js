/**
 * Copyright (c) 2020-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-restricted-globals */
/* global importScripts, workbox */

importScripts('<WORKBOX_DIR>/workbox-sw.js');

const precacheManifest = self.__WB_MANIFEST;

// Code copied over from workbox manifest template: https://git.io/Jve4T
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
workbox.precaching.precacheAndRoute(precacheManifest, {
  urlManipulation: ({url}) => {
    const parts = url.pathname.split('/').filter(part => part);
    const isFile = parts[parts.length - 1].split('.').length > 1;
    const isExternal = url.hostname !== location.hostname;
    // Routes like /blog need to be redirected to the actual asset in the server
    // precache manifest. For example, /blog needs to be routed to
    // /blog/index.html.
    return isExternal || isFile ? [url] : [new URL(`${url.href}/index.html`)];
  },
});
