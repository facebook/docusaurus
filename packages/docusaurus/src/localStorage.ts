/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface StorageSlot {
  get: () => string | null;
  set: (value: string) => void;
  del: () => void;
}

/**
 * Returns a list of all the keys currently stored in localStorage
 * or an empty list if localStorage can't be accessed.
 */
export function listStorageKeys(): string[] {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key !== null) {
        keys.push(key);
      }
    }
    return keys;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * Creates an object for accessing a particular key in localStorage.
 * Returns null if localStorage can't be accessed.
 */
export const createStorageSlot = (key: string): StorageSlot | null => {
  try {
    localStorage.getItem;
  } catch (_) {
    return null;
  }

  const get = () => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const set = (value: string) => {
    return localStorage.setItem(key, value);
  };

  const del = () => {
    return localStorage.removeItem(key);
  };

  return {
    get,
    set,
    del,
  };
};
