/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {URL} from 'url';

export default function formatUrl(urlToFormat: string): string {
  try {
    const parsedUrl = new URL(urlToFormat);

    return parsedUrl.href;
  } catch (e) {
    return urlToFormat;
  }
}
