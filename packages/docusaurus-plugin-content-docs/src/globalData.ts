/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Sidebar} from './sidebars/types';
import {getFirstDocIdOfSidebar} from './sidebars/utils';
import type {
  DocMetadata,
  GlobalDoc,
  LoadedVersion,
  GlobalVersion,
  GlobalSidebar,
} from './types';

export function toGlobalDataDoc(doc: DocMetadata): GlobalDoc {
  return {
    id: doc.unversionedId,
    path: doc.permalink,
    sidebar: doc.sidebar,
  };
}

export function toGlobalSidebar(
  sidebarId: string,
  sidebar: Sidebar,
): GlobalSidebar {
  const sidebarFirstDocId = getFirstDocIdOfSidebar(sidebar);
  return {
    link: {
      label: sidebarId,
      path: sidebarFirstDocId,
    },
  };
}

export function toGlobalDataVersion(version: LoadedVersion): GlobalVersion {
  const globalSidebarRecord: Record<string, GlobalSidebar> = {};
  Object.entries(version.sidebars).forEach(([sidebarId, sidebar]) => {
    const globalSidebarObject = toGlobalSidebar(sidebarId, sidebar);
    globalSidebarRecord[sidebarId] = globalSidebarObject;
  });
  return {
    name: version.versionName,
    label: version.versionLabel,
    isLast: version.isLast,
    path: version.versionPath,
    mainDocId: version.mainDocId,
    docs: version.docs.map(toGlobalDataDoc),
    sidebars: globalSidebarRecord,
  };
}
