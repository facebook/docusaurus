/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import type {Sidebars} from './sidebars/types';
import {createSidebarsUtils} from './sidebars/utils';
import type {LoadedVersion} from './types';
import type {
  CategoryGeneratedIndexMetadata,
  DocMetadata,
} from '@docusaurus/plugin-content-docs';
import type {
  GlobalVersion,
  GlobalSidebar,
  GlobalDoc,
} from '@docusaurus/plugin-content-docs/client';

function toGlobalDataDoc(doc: DocMetadata): GlobalDoc {
  return {
    id: doc.unversionedId,
    path: doc.permalink,
    sidebar: doc.sidebar,
  };
}

function toGlobalDataGeneratedIndex(
  doc: CategoryGeneratedIndexMetadata,
): GlobalDoc {
  return {
    id: doc.slug,
    path: doc.permalink,
    sidebar: doc.sidebar,
  };
}

function toGlobalSidebars(
  sidebars: Sidebars,
  version: LoadedVersion,
): {[sidebarId: string]: GlobalSidebar} {
  const {getFirstLink} = createSidebarsUtils(sidebars);
  return _.mapValues(sidebars, (sidebar, sidebarId) => {
    const firstLink = getFirstLink(sidebarId);
    if (!firstLink) {
      return {};
    }
    return {
      link: {
        path:
          firstLink.type === 'generated-index'
            ? firstLink.permalink
            : version.docs.find(
                (doc) =>
                  doc.id === firstLink.id || doc.unversionedId === firstLink.id,
              )!.permalink,
        label: firstLink.label,
      },
    };
  });
}

export function toGlobalDataVersion(version: LoadedVersion): GlobalVersion {
  return {
    name: version.versionName,
    label: version.label,
    isLast: version.isLast,
    path: version.path,
    mainDocId: version.mainDocId,
    docs: version.docs
      .map(toGlobalDataDoc)
      .concat(version.categoryGeneratedIndices.map(toGlobalDataGeneratedIndex)),
    sidebars: toGlobalSidebars(version.sidebars, version),
  };
}
