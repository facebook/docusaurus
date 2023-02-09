/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function supports(feature: string) {
  try {
    const fakeLink = document.createElement('link');
    return fakeLink.relList.supports(feature);
  } catch {
    return false;
  }
}

function linkPrefetchStrategy(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject();
      return;
    }

    const link = document.createElement('link');
    link.setAttribute('rel', 'prefetch');
    link.setAttribute('href', url);

    link.onload = () => resolve();
    link.onerror = () => reject();

    const parentElement =
      document.getElementsByTagName('head')[0] ??
      document.getElementsByName('script')[0]?.parentNode;
    parentElement?.appendChild(link);
  });
}

function xhrPrefetchStrategy(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.withCredentials = true;

    req.onload = () => {
      if (req.status === 200) {
        resolve();
      } else {
        reject();
      }
    };

    req.send(null);
  });
}

const supportedPrefetchStrategy = supports('prefetch')
  ? linkPrefetchStrategy
  : xhrPrefetchStrategy;

export default function prefetch(url: string): Promise<void> {
  return supportedPrefetchStrategy(url).catch(() => {}); // 404s are logged to the console anyway.
}
