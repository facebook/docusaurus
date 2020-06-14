/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from './useDocusaurusContext';
import isInternalUrl from './isInternalUrl';

type BaseUrlOptions = {
  forcePrependBaseUrl: boolean;
  absolute: boolean;
};

export default function useBaseUrl(
  url: string,
  {forcePrependBaseUrl = false, absolute = false}: Partial<BaseUrlOptions> = {},
): string {
  const {
    siteConfig: {baseUrl = '/', url: siteUrl} = {},
  } = useDocusaurusContext();

  if (!url) {
    return url;
  }

  if (forcePrependBaseUrl) {
    return baseUrl + url;
  }

  if (!isInternalUrl(url)) {
    return url;
  }

  const basePath = baseUrl + url.replace(/^\//, '');

  return absolute ? siteUrl + basePath : basePath;
}
