/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from './useDocusaurusContext';

function withBaseUrl(url: string): string {
  const {siteConfig} = useDocusaurusContext();
  const {baseUrl = '/'} = siteConfig || {};

  const externalRegex = /^(https?:|\/\/)/;
  if (externalRegex.test(url)) {
    return url;
  }
  if (url.startsWith('/')) {
    return baseUrl + url.slice(1);
  }
  return baseUrl + url;
}

export default withBaseUrl;
