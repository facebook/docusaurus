/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback, useRef} from 'react';
// @ts-expect-error: TODO temp error until React 18 upgrade
import {useSyncExternalStore} from 'use-sync-external-store/shim';

const StorageTypes = ['localStorage', 'sessionStorage', 'none'] as const;

export type StorageType = typeof StorageTypes[number];

const DefaultStorageType: StorageType = 'localStorage';

// Because we need our own event system to allow subscribing to events
// window.addEventListener('storage') only works for different windows...
// see https://stackoverflow.com/questions/26974084/listen-for-changes-with-localstorage-on-the-same-window
interface StorageSlotChangeEvent {
  key: string;
  value: string | null;
  storage: Storage;
}

const CustomEventName = 'StorageSlotChangeEvent';

function dispatchChangeEvent({
  key,
  value,
  storage,
}: {
  key: string;
  value: string | null;
  storage: Storage;
}) {
  const event = new CustomEvent<StorageSlotChangeEvent>(CustomEventName, {
    detail: {
      key,
      value,
      storage,
    },
  });
  window.dispatchEvent(event);
}

function subscribeChangeEvents(
  onChange: (event: StorageSlotChangeEvent) => void,
): () => void {
  const listener = (domEvent: CustomEvent<StorageSlotChangeEvent>) =>
    onChange(domEvent.detail);
  // @ts-expect-error: TODO custom events are annoying to type
  window.addEventListener(CustomEventName, listener);
  // @ts-expect-error: TODO custom events are annoying to type
  return () => window.removeEventListener(CustomEventName, listener);
}

/**
 * Will return `null` if browser storage is unavailable (like running Docusaurus
 * in an iframe). This should NOT be called in SSR.
 *
 * @see https://github.com/facebook/docusaurus/pull/4501
 */
function getBrowserStorage(
  storageType: StorageType = DefaultStorageType,
): Storage | null {
  if (typeof window === 'undefined') {
    throw new Error(
      'Browser storage is not available on Node.js/Docusaurus SSR process.',
    );
  }
  if (storageType === 'none') {
    return null;
  }
  try {
    return window[storageType];
  } catch (err) {
    logOnceBrowserStorageNotAvailableWarning(err as Error);
    return null;
  }
}

let hasLoggedBrowserStorageNotAvailableWarning = false;
/**
 * Poor man's memoization to avoid logging multiple times the same warning.
 * Sometimes, `localStorage`/`sessionStorage` is unavailable due to browser
 * policies.
 */
function logOnceBrowserStorageNotAvailableWarning(error: Error) {
  if (!hasLoggedBrowserStorageNotAvailableWarning) {
    console.warn(
      `Docusaurus browser storage is not available.
Possible reasons: running Docusaurus in an iframe, in an incognito browser session, or using too strict browser privacy settings.`,
      error,
    );
    hasLoggedBrowserStorageNotAvailableWarning = true;
  }
}

// Convenient storage interface for a single storage key
export type StorageSlot = {
  get: () => string | null;
  set: (value: string) => void;
  del: () => void;
  listen: (onChange: (value: string | null) => void) => () => void;
};

const NoopStorageSlot: StorageSlot = {
  get: () => null,
  set: () => {},
  del: () => {},
  listen: () => () => {},
};

// Fail-fast, as storage APIs should not be used during the SSR process
function createServerStorageSlot(key: string): StorageSlot {
  function throwError(): never {
    throw new Error(`Illegal storage API usage for storage key "${key}".
Docusaurus storage APIs are not supposed to be called on the server-rendering process.
Please only call storage APIs in effects and event handlers.`);
  }

  return {
    get: throwError,
    set: throwError,
    del: throwError,
    listen: throwError,
  };
}

/**
 * Creates an interface to work on a particular key in the storage model.
 * Note that this function only initializes the interface, but doesn't allocate
 * anything by itself (i.e. no side-effects).
 *
 * The API is fail-safe, since usage of browser storage should be considered
 * unreliable. Local storage might simply be unavailable (iframe + browser
 * security) or operations might fail individually. Please assume that using
 * this API can be a no-op. See also https://github.com/facebook/docusaurus/issues/6036
 */
export function createStorageSlot(
  key: string,
  options?: {persistence?: StorageType},
): StorageSlot {
  if (typeof window === 'undefined') {
    return createServerStorageSlot(key);
  }
  const storage = getBrowserStorage(options?.persistence);
  if (storage === null) {
    return NoopStorageSlot;
  }
  return {
    get: () => {
      try {
        return storage.getItem(key);
      } catch (err) {
        console.error(`Docusaurus storage error, can't get key=${key}`, err);
        return null;
      }
    },
    set: (value) => {
      try {
        storage.setItem(key, value);
        dispatchChangeEvent({key, value, storage});
      } catch (err) {
        console.error(
          `Docusaurus storage error, can't set ${key}=${value}`,
          err,
        );
      }
    },
    del: () => {
      try {
        storage.removeItem(key);
        dispatchChangeEvent({key, value: null, storage});
      } catch (err) {
        console.error(`Docusaurus storage error, can't delete key=${key}`, err);
      }
    },
    listen: (onChange) => {
      try {
        return subscribeChangeEvents((event) => {
          if (event.storage === storage && event.key === key) {
            onChange(event.value);
          }
        });
      } catch (err) {
        console.error(
          `Docusaurus storage error, can't listen for changes of key=${key}`,
          err,
        );
        return () => {};
      }
    },
  };
}

export function useStorageSlot(
  key: string | null,
  options?: {persistence?: StorageType},
): [string | null, StorageSlot] {
  // Not ideal but good enough: assumes storage slot config is constant
  const storageSlot = useRef(() => {
    if (key === null) {
      return NoopStorageSlot;
    }
    return createStorageSlot(key, options);
  }).current();

  const listen: StorageSlot['listen'] = useCallback(
    (onChange) => {
      // Do not try to add a listener during SSR
      if (typeof window === 'undefined') {
        return () => {};
      }
      return storageSlot.listen(onChange);
    },
    [storageSlot],
  );

  const currentValue = useSyncExternalStore(
    listen,
    () => {
      // TODO this check should be useless after React 18
      if (typeof window === 'undefined') {
        return null;
      }
      return storageSlot.get();
    },
    () => null,
  );

  return [currentValue, storageSlot];
}

/**
 * Returns a list of all the keys currently stored in browser storage,
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
