/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from './useDocusaurusContext';

export default function useBaseUrl(
  url: string,
  forcePrependBaseUrl: boolean = false,
): string {
  const {siteConfig} = useDocusaurusContext();
  const {baseUrl = '/'} = siteConfig || {};

  if (!url) {
    return url;
  }

  if (forcePrependBaseUrl) {
    return baseUrl + url;
  }

  const externalRegex = /^(https?:|\/\/)/;
  if (externalRegex.test(url)) {
    return url;
  }

  if (url.startsWith('/')) {
    return baseUrl + url.slice(1);
  }

  return baseUrl + url;
}
