/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {SitemapStream, streamToPromise} from 'sitemap';
import type {SitemapItem} from './types';

export async function sitemapItemsToXmlString(
  items: SitemapItem[],
): Promise<string> {
  if (items.length === 0) {
    // Note: technically we could, but there is a bug in the lib code
    // and the code below would never resolve, so it's better to fail fast
    throw new Error("Can't generate a sitemap with no items");
  }
  const sitemapStream = new SitemapStream();
  items.forEach((item) => sitemapStream.write(item));
  sitemapStream.end();
  const buffer = await streamToPromise(sitemapStream);
  return buffer.toString();
}
