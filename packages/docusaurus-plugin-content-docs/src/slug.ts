/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  addLeadingSlash,
  addTrailingSlash,
  isValidPathname,
  resolvePathname,
} from '@docusaurus/utils';
import {
  DefaultNumberPrefixParser,
  stripPathNumberPrefixes,
} from './numberPrefix';
import type {DocMetadataBase} from './types';
import {isCategoryIndex, toCategoryIndexMatcherParam} from './docs';
import type {NumberPrefixParser} from '@docusaurus/plugin-content-docs';

export default function getSlug({
  baseID,
  frontMatterSlug,
  source,
  sourceDirName,
  stripDirNumberPrefixes = true,
  numberPrefixParser = DefaultNumberPrefixParser,
}: {
  baseID: string;
  frontMatterSlug?: string;
  source: DocMetadataBase['source'];
  sourceDirName: DocMetadataBase['sourceDirName'];
  stripDirNumberPrefixes?: boolean;
  numberPrefixParser?: NumberPrefixParser;
}): string {
  function getDirNameSlug(): string {
    const dirNameStripped = stripDirNumberPrefixes
      ? stripPathNumberPrefixes(sourceDirName, numberPrefixParser)
      : sourceDirName;
    const resolveDirname =
      sourceDirName === '.'
        ? '/'
        : addLeadingSlash(addTrailingSlash(dirNameStripped));
    return resolveDirname;
  }

  function computeSlug(): string {
    if (frontMatterSlug?.startsWith('/')) {
      return frontMatterSlug;
    }
    const dirNameSlug = getDirNameSlug();
    if (
      !frontMatterSlug &&
      isCategoryIndex(toCategoryIndexMatcherParam({source, sourceDirName}))
    ) {
      return dirNameSlug;
    }
    const baseSlug = frontMatterSlug || baseID;
    return resolvePathname(baseSlug, getDirNameSlug());
  }

  function ensureValidSlug(slug: string): string {
    if (!isValidPathname(slug)) {
      throw new Error(
        `We couldn't compute a valid slug for document with id "${baseID}" in "${sourceDirName}" directory.
The slug we computed looks invalid: ${slug}.
Maybe your slug front matter is incorrect or you use weird chars in the file path?
By using the slug front matter, you should be able to fix this error, by using the slug of your choice:

Example =>
---
slug: /my/customDocPath
---
`,
      );
    }
    return slug;
  }

  return ensureValidSlug(computeSlug());
}
