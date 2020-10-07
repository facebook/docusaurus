/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useAllDocsData, useActivePluginAndVersion} from '@theme/hooks/useDocs';

export default function useDocsearchParameters() {
  const allDocsData = useAllDocsData();
  const activePluginAndVersion = useActivePluginAndVersion();

  function getDocPluginFacetFilters(docPluginId: string) {
    const activeVersion =
      activePluginAndVersion &&
      activePluginAndVersion.pluginId === docPluginId &&
      activePluginAndVersion.version
        ? activePluginAndVersion.version
        : undefined;
    const fallbackVersion = allDocsData[docPluginId].versions.find(
      (v) => v.isLast,
    );

    const facetVersion = activeVersion ?? fallbackVersion;

    return `version:${docPluginId}-${facetVersion.name}`;
  }

  const facetFilters = [
    // `language:en`, // TODO
    [
      `default`,
      ...Object.keys(allDocsData).map(getDocPluginFacetFilters),
      /*
      `version:ios-1.0`,
      `version:android-3.0`,
      `version:js-unreleased`,

       */
    ],
  ];

  return {
    facetFilters,
  };
}
