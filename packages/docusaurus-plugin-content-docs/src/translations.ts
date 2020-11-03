/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {LoadedVersion, Sidebar} from './types';

import {chain, mapValues} from 'lodash';
import {collectSidebarCategories} from './sidebars';

function getVersionSidebarTranslation(sidebar: Sidebar) {
  const categories = collectSidebarCategories(sidebar);
  return chain(categories)
    .keyBy((category) => category.label)
    .mapValues((category) => category.label)
    .value();
}

export function getVersionTranslations(version: LoadedVersion) {
  const sidebars = mapValues(version.sidebars, getVersionSidebarTranslation);

  const docs = version.docs.map((doc) => ({
    title: doc.title,
    ...(doc.sidebar_label ? {sidebarLabel: doc.sidebar_label} : undefined),
  }));

  return {
    label: version.versionLabel,
    sidebars,
    docs,
  };
}

export function getAllVersionsTranslations(versions: LoadedVersion[]) {
  return chain(versions)
    .keyBy((version) => version.versionName)
    .mapValues(getVersionTranslations)
    .value();
}
