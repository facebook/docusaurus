/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizeUrl, simpleHash} from '@docusaurus/utils';
import type {DocusaurusConfig, SiteStorage} from '@docusaurus/types';

type Params = Pick<DocusaurusConfig, 'url' | 'baseUrl' | 'future'>;

function automaticNamespace(params: Params): string {
  return simpleHash(normalizeUrl([params.url, params.baseUrl]), 3);
}

function getNamespaceString(params: Params): string | null {
  if (params.future.experimental_storage.namespace === true) {
    return automaticNamespace(params);
  } else if (params.future.experimental_storage.namespace === false) {
    return null;
  } else {
    return params.future.experimental_storage.namespace;
  }
}

export function createSiteStorage(config: DocusaurusConfig): SiteStorage {
  const {type} = config.future.experimental_storage;
  const namespaceString = getNamespaceString(config);

  const namespace = namespaceString ? `-${namespaceString}` : '';
  return {
    type,
    namespace,
  };
}
