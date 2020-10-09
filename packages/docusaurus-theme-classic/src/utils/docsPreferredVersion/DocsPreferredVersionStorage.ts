/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {DocsVersionPersistence} from '../useThemeConfig';

const storageKey = (pluginId: string) => `docs-preferred-version-${pluginId}`;

const DocsPreferredVersionStorage = {
  save: (
    pluginId: string,
    persistence: DocsVersionPersistence,
    versionName: string,
  ): void => {
    if (persistence === 'none') {
      // noop
    } else {
      window.localStorage.setItem(storageKey(pluginId), versionName);
    }
  },

  read: (
    pluginId: string,
    persistence: DocsVersionPersistence,
  ): string | null => {
    if (persistence === 'none') {
      return null;
    } else {
      return window.localStorage.getItem(storageKey(pluginId));
    }
  },

  clear: (pluginId: string, persistence: DocsVersionPersistence): void => {
    if (persistence === 'none') {
      // noop
    } else {
      window.localStorage.removeItem(storageKey(pluginId));
    }
  },
};

export default DocsPreferredVersionStorage;
