/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {SitemapStream, streamToPromise} from 'sitemap';
import type {LastModOption, SitemapItem} from './types';

export async function sitemapItemsToXmlString(
  items: SitemapItem[],
  options: {lastmod: LastModOption | null},
): Promise<string> {
  if (items.length === 0) {
    // Note: technically we could, but there is a bug in the lib code
    // and the code below would never resolve, so it's better to fail fast
    throw new Error("Can't generate a sitemap with no items");
  }

  // TODO remove sitemap lib dependency?
  //  https://github.com/ekalinin/sitemap.js
  //  it looks like an outdated confusion super old lib
  //  we might as well achieve the same result with a pure xml lib
  const sitemapStream = new SitemapStream({
    // WTF is this lib reformatting the string YYYY-MM-DD to datetime...
    lastmodDateOnly: options?.lastmod === 'date',
  });

  items.forEach((item) => sitemapStream.write(item));
  sitemapStream.end();

  const buffer = await streamToPromise(sitemapStream);
  return buffer.toString();
}
