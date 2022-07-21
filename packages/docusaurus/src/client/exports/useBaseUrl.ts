/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {addBaseUrl} from '@docusaurus/utils-common';
import useDocusaurusContext from './useDocusaurusContext';
import type {BaseUrlOptions, BaseUrlUtils} from '@docusaurus/useBaseUrl';

export function useBaseUrlUtils(): BaseUrlUtils {
  const {
    siteConfig: {baseUrl, url: siteUrl},
  } = useDocusaurusContext();
  return {
    withBaseUrl: (url, options) => addBaseUrl(siteUrl, baseUrl, url, options),
  };
}

export default function useBaseUrl(
  url: string,
  options: BaseUrlOptions = {},
): string {
  const {withBaseUrl} = useBaseUrlUtils();
  return withBaseUrl(url, options);
}
