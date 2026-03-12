/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizeUrl, simpleHash} from '@docusaurus/utils';
import {addTrailingSlash} from '@docusaurus/utils-common';
import type {DocusaurusConfig, SiteStorage} from '@docusaurus/types';

type PartialConfig = Pick<DocusaurusConfig, 'url' | 'baseUrl' | 'storage'>;

function automaticNamespace(config: PartialConfig): string {
  const normalizedUrl = addTrailingSlash(
    normalizeUrl([config.url, config.baseUrl]),
  );
  return simpleHash(normalizedUrl, 3);
}

function getNamespaceString(config: PartialConfig): string | null {
  const {namespace} = config.storage;

  if (namespace === true) {
    return automaticNamespace(config);
  } else if (namespace === false) {
    return null;
  } else {
    return namespace;
  }
}

export function createSiteStorage(config: PartialConfig): SiteStorage {
  const {type} = config.storage;
  const namespaceString = getNamespaceString(config);

  const namespace = namespaceString ? `-${namespaceString}` : '';
  return {
    type,
    namespace,
  };
}
