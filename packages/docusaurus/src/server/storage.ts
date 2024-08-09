/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizeUrl, simpleHash} from '@docusaurus/utils';
import {addTrailingSlash} from '@docusaurus/utils-common';
import type {DocusaurusConfig, SiteStorage} from '@docusaurus/types';

type PartialFuture = Pick<DocusaurusConfig['future'], 'experimental_storage'>;

type PartialConfig = Pick<DocusaurusConfig, 'url' | 'baseUrl'> & {
  future: PartialFuture;
};

function automaticNamespace(config: PartialConfig): string {
  const normalizedUrl = addTrailingSlash(
    normalizeUrl([config.url, config.baseUrl]),
  );
  return simpleHash(normalizedUrl, 3);
}

function getNamespaceString(config: PartialConfig): string | null {
  if (config.future.experimental_storage.namespace === true) {
    return automaticNamespace(config);
  } else if (config.future.experimental_storage.namespace === false) {
    return null;
  } else {
    return config.future.experimental_storage.namespace;
  }
}

export function createSiteStorage(config: PartialConfig): SiteStorage {
  const {type} = config.future.experimental_storage;
  const namespaceString = getNamespaceString(config);

  const namespace = namespaceString ? `-${namespaceString}` : '';
  return {
    type,
    namespace,
  };
}
