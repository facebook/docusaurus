/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from './useDocusaurusContext';
import isInternalUrl from './isInternalUrl';

type BaseUrlOptions = Partial<{
  forcePrependBaseUrl: boolean;
  absolute: boolean;
}>;

function addBaseUrl(
  siteUrl: string | undefined,
  baseUrl: string,
  url: string,
  {forcePrependBaseUrl = false, absolute = false}: BaseUrlOptions = {},
): string {
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

export type BaseUrlUtils = {
  withBaseUrl: (url: string, options: BaseUrlOptions) => string;
};

export function useBaseUrlUtils(): BaseUrlUtils {
  const {
    siteConfig: {baseUrl = '/', url: siteUrl} = {},
  } = useDocusaurusContext();
  return {
    withBaseUrl: (url, options) => {
      return addBaseUrl(siteUrl, baseUrl, url, options);
    },
  };
}

export default function useBaseUrl(
  url: string,
  options: BaseUrlOptions,
): string {
  const {withBaseUrl} = useBaseUrlUtils();
  return withBaseUrl(url, options);
}
