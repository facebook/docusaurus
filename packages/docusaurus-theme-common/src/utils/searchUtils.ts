/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  useAllDocsData,
  useActivePluginAndVersion,
} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useDocsPreferredVersionByPluginId} from '../contexts/docsPreferredVersion';

export const DEFAULT_SEARCH_TAG = 'default';

/** The search tag to append as each doc's metadata. */
export function docVersionSearchTag(
  pluginId: string,
  versionName: string,
): string {
  return `docs-${pluginId}-${versionName}`;
}

/**
 * Gets the relevant context information for contextual search.
 *
 * The value is generic and not coupled to Algolia/DocSearch, since we may want
 * to support multiple search engines, or allowing users to use their own search
 * engine solution.
 */
export function useContextualSearchFilters(): {locale: string; tags: string[]} {
  const {i18n} = useDocusaurusContext();
  const allDocsData = useAllDocsData();
  const activePluginAndVersion = useActivePluginAndVersion();
  const docsPreferredVersionByPluginId = useDocsPreferredVersionByPluginId();

  // This can't use more specialized hooks because we are mapping over all
  // plugin instances.
  function getDocPluginTags(pluginId: string) {
    const activeVersion =
      activePluginAndVersion?.activePlugin.pluginId === pluginId
        ? activePluginAndVersion.activeVersion
        : undefined;

    const preferredVersion = docsPreferredVersionByPluginId[pluginId];

    const latestVersion = allDocsData[pluginId]!.versions.find(
      (v) => v.isLast,
    )!;

    const version = activeVersion ?? preferredVersion ?? latestVersion;

    return docVersionSearchTag(pluginId, version.name);
  }

  const tags = [
    DEFAULT_SEARCH_TAG,
    ...Object.keys(allDocsData).map(getDocPluginTags),
  ];

  return {
    locale: i18n.currentLocale,
    tags,
  };
}
