/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useAllDocsData, useActivePluginAndVersion} from '@theme/hooks/useDocs';
import {useDocsPreferredVersionByPluginId} from '../../utils/docsPreferredVersion/useDocsPreferredVersion';

// TODO decouple this from DocSearch?
// Maybe users will want to use its own search engine solution
export default function useSearchTags() {
  const allDocsData = useAllDocsData();
  const activePluginAndVersion = useActivePluginAndVersion();
  const docsPreferredVersionByPluginId = useDocsPreferredVersionByPluginId();

  function getDocPluginTags(pluginId: string) {
    const activeVersion =
      activePluginAndVersion?.activePlugin?.pluginId === pluginId
        ? activePluginAndVersion.activeVersion
        : undefined;

    const preferredVersion = docsPreferredVersionByPluginId[pluginId];

    const latestVersion = allDocsData[pluginId].versions.find((v) => v.isLast);

    const facetVersion = activeVersion ?? preferredVersion ?? latestVersion;

    return `version:${pluginId}-${facetVersion.name}`;
  }

  const tags = [
    // `language:en`, // TODO on i18n branch, later
    // [
    `default`,
    ...Object.keys(allDocsData).map(getDocPluginTags),
    /*
      `version:ios-1.0`,
      `version:android-3.0`,
      `version:js-unreleased`,
       */
    // ],
  ];

  return tags;
}
