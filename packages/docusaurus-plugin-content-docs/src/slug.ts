/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {isValidPathname, resolvePathname} from '@docusaurus/utils';
import {addLeadingSlash, addTrailingSlash} from '@docusaurus/utils-common';
import {
  DefaultNumberPrefixParser,
  stripPathNumberPrefixes,
} from './numberPrefix';
import {isCategoryIndex, toCategoryIndexMatcherParam} from './docs';
import type {
  NumberPrefixParser,
  DocMetadataBase,
} from '@docusaurus/plugin-content-docs';

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
    const baseSlug = frontMatterSlug ?? baseID;
    return resolvePathname(baseSlug, getDirNameSlug());
  }

  function ensureValidSlug(slug: string): string {
    if (!isValidPathname(slug)) {
      throw new Error(
        `We couldn't compute a valid slug for document with ID "${baseID}" in "${sourceDirName}" directory.
The slug we computed looks invalid: ${slug}.
Maybe your slug front matter is incorrect or there are special characters in the file path?
By using front matter to set a custom slug, you should be able to fix this error:

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
