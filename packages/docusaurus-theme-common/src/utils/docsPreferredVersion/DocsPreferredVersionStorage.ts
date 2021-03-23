/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createStorageSlot} from '@docusaurus/core/src/localStorage';
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
      createStorageSlot(storageKey(pluginId))?.set(versionName);
    }
  },

  read: (
    pluginId: string,
    persistence: DocsVersionPersistence,
  ): string | null => {
    if (persistence === 'none') {
      return null;
    } else {
      return createStorageSlot(storageKey(pluginId))?.get() ?? null;
    }
  },

  clear: (pluginId: string, persistence: DocsVersionPersistence): void => {
    if (persistence === 'none') {
      // noop
    } else {
      createStorageSlot(storageKey(pluginId))?.del();
    }
  },
};

export default DocsPreferredVersionStorage;
