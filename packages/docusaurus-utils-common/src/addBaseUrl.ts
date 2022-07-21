/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {hasProtocol} from './isInternalUrl';
import type {BaseUrlOptions} from '@docusaurus/types';

export function addBaseUrl(
  siteUrl: string,
  baseUrl: string,
  url: string,
  {forcePrependBaseUrl = false, absolute = false}: BaseUrlOptions = {},
): string {
  // It never makes sense to add base url to a local anchor url, or one with a
  // protocol
  if (!url || url.startsWith('#') || hasProtocol(url)) {
    return url;
  }

  if (forcePrependBaseUrl) {
    return baseUrl + url.replace(/^\//, '');
  }

  // /baseUrl -> /baseUrl/
  // https://github.com/facebook/docusaurus/issues/6315
  if (url === baseUrl.replace(/\/$/, '')) {
    return baseUrl;
  }

  // We should avoid adding the baseurl twice if it's already there
  const shouldAddBaseUrl = !url.startsWith(baseUrl);

  const basePath = shouldAddBaseUrl ? baseUrl + url.replace(/^\//, '') : url;

  return absolute ? siteUrl + basePath : basePath;
}
