/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from './useDocusaurusContext';

export function withBaseUrl(baseUrl: string, url: string): string {
  if (url.startsWith('/')) {
    return baseUrl + url.slice(1);
  }
  return baseUrl + url;
}

function useBaseUrl(url: string): string {
  const {siteConfig} = useDocusaurusContext();
  const {baseUrl = '/'} = siteConfig || {};

  const externalRegex = /^(https?:|\/\/)/;
  if (externalRegex.test(url)) {
    return url;
  }
  return withBaseUrl(baseUrl, url);
}

export default useBaseUrl;
