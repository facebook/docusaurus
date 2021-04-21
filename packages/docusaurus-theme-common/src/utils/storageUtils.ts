/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const StorageTypes = ['localStorage', 'sessionStorage', 'none'] as const;

export type StorageType = typeof StorageTypes[number];

const DefaultStorageType: StorageType = 'localStorage';

// Will return null browser storage is unavailable (like running Docusaurus in iframe)
// See https://github.com/facebook/docusaurus/pull/4501
function getBrowserStorage(
  storageType: StorageType = DefaultStorageType,
): Storage | null {
  if (typeof window === 'undefined') {
    throw new Error(
      'Browser storage is not available on NodeJS / Docusaurus SSR process',
    );
  }
  if (storageType === 'none') {
    return null;
  } else {
    try {
      return window[storageType];
    } catch (e) {
      logOnceBrowserStorageNotAvailableWarning(e);
      return null;
    }
  }
}

/**
 * Poor man's memoization to avoid logging multiple times the same warning
 * Sometimes, localStorage/sessionStorage is unavailable due to browser policies
 */
let hasLoggedBrowserStorageNotAvailableWarning = false;
function logOnceBrowserStorageNotAvailableWarning(error: Error) {
  if (!hasLoggedBrowserStorageNotAvailableWarning) {
    console.warn(
      `Docusaurus browser storage is not available.
Possible reasons: running Docusaurus in an Iframe, in an Incognito browser session, or using too strict browser privacy settings.`,
      error,
    );
    hasLoggedBrowserStorageNotAvailableWarning = true;
  }
}

// Convenient storage interface for a single storage key
export interface StorageSlot {
  get: () => string | null;
  set: (value: string) => void;
  del: () => void;
}

const NoopStorageSlot: StorageSlot = {
  get: () => null,
  set: () => {},
  del: () => {},
};

//  Fail-fast, as storage APIs should not be used during the SSR process
function createServerStorageSlot(key: string): StorageSlot {
  function throwError(): never {
    throw new Error(`Illegal storage API usage for storage key=${key}.
Docusaurus storage APIs are not supposed to be called on the server-rendering process.
Please only call storage APIs in effects and event handlers.`);
  }

  return {
    get: throwError,
    set: throwError,
    del: throwError,
  };
}

/**
 * Creates an object for accessing a particular key in localStorage.
 */
export const createStorageSlot = (
  key: string,
  options?: {persistence?: StorageType},
): StorageSlot => {
  if (typeof window === 'undefined') {
    return createServerStorageSlot(key);
  }
  const browserStorage = getBrowserStorage(options?.persistence);
  if (browserStorage === null) {
    return NoopStorageSlot;
  }
  return {
    get: () => browserStorage.getItem(key),
    set: (value) => browserStorage.setItem(key, value),
    del: () => browserStorage.removeItem(key),
  };
};

/**
 * Returns a list of all the keys currently stored in browser storage
 * or an empty list if browser storage can't be accessed.
 */
export function listStorageKeys(
  storageType: StorageType = DefaultStorageType,
): string[] {
  const browserStorage = getBrowserStorage(storageType);
  if (!browserStorage) {
    return [];
  }

  const keys: string[] = [];
  for (let i = 0; i < browserStorage.length; i += 1) {
    const key = browserStorage.key(i);
    if (key !== null) {
      keys.push(key);
    }
  }
  return keys;
}
