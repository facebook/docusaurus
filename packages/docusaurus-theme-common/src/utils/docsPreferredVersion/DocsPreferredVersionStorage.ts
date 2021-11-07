/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createStorageSlot} from '../storageUtils';
import {DocsVersionPersistence} from '../useThemeConfig';

const storageKey = (pluginId: string) => `docs-preferred-version-${pluginId}`;

const DocsPreferredVersionStorage = {
  save: (
    pluginId: string,
    persistence: DocsVersionPersistence,
    versionName: string,
  ): void => {
    createStorageSlot(storageKey(pluginId), {persistence}).set(versionName);
  },

  read: (
    pluginId: string,
    persistence: DocsVersionPersistence,
  ): string | null => {
    return createStorageSlot(storageKey(pluginId), {persistence}).get();
  },

  clear: (pluginId: string, persistence: DocsVersionPersistence): void => {
    createStorageSlot(storageKey(pluginId), {persistence}).del();
  },
};

export default DocsPreferredVersionStorage;
