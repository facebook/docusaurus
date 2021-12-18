/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useAllDocsData, useActivePluginAndVersion} from '@theme/hooks/useDocs';
import {useDocsPreferredVersionByPluginId} from './docsPreferredVersion/useDocsPreferredVersion';
import {docVersionSearchTag, DEFAULT_SEARCH_TAG} from './searchUtils';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export type useContextualSearchFiltersReturns = {
  locale: string;
  tags: string[];
};

// We may want to support multiple search engines, don't couple that to Algolia/DocSearch
// Maybe users will want to use its own search engine solution
export function useContextualSearchFilters(): useContextualSearchFiltersReturns {
  const {i18n} = useDocusaurusContext();
  const allDocsData = useAllDocsData();
  const activePluginAndVersion = useActivePluginAndVersion();
  const docsPreferredVersionByPluginId = useDocsPreferredVersionByPluginId();

  function getDocPluginTags(pluginId: string) {
    const activeVersion =
      activePluginAndVersion?.activePlugin?.pluginId === pluginId
        ? activePluginAndVersion.activeVersion
        : undefined;

    const preferredVersion = docsPreferredVersionByPluginId[pluginId];

    const latestVersion = allDocsData[pluginId].versions.find((v) => v.isLast)!;

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
