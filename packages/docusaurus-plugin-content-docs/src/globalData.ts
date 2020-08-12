/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DocMetadata, GlobalDoc, LoadedVersion, GlobalVersion} from './types';

export function toGlobalDataDoc(doc: DocMetadata): GlobalDoc {
  return {
    id: doc.unversionedId,
    path: doc.permalink,
  };
}

export function toGlobalDataVersion(version: LoadedVersion): GlobalVersion {
  return {
    name: version.versionName,
    path: version.versionPath,
    mainDocId: version.mainDocId,
    docs: version.docs
      .map(toGlobalDataDoc)
      // stable ordering, useful for tests
      .sort((a, b) => a.id.localeCompare(b.id)),
  };
}
