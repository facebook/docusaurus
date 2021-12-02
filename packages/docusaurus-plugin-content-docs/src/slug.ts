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
import type {NumberPrefixParser} from './types';

export default function getSlug({
  baseID,
  frontmatterSlug,
  sourceDirName,
  stripDirNumberPrefixes = true,
  numberPrefixParser = DefaultNumberPrefixParser,
}: {
  baseID: string;
  frontmatterSlug?: string;
  sourceDirName: string;
  stripDirNumberPrefixes?: boolean;
  numberPrefixParser?: NumberPrefixParser;
}): string {
  const baseSlug = frontmatterSlug || baseID;
  let slug: string;
  if (baseSlug.startsWith('/')) {
    slug = baseSlug;
  } else {
    const dirNameStripped = stripDirNumberPrefixes
      ? stripPathNumberPrefixes(sourceDirName, numberPrefixParser)
      : sourceDirName;
    const resolveDirname =
      sourceDirName === '.'
        ? '/'
        : addLeadingSlash(addTrailingSlash(dirNameStripped));
    slug = resolvePathname(baseSlug, resolveDirname);
  }

  if (!isValidPathname(slug)) {
    throw new Error(
      `We couldn't compute a valid slug for document with id "${baseID}" in "${sourceDirName}" directory.
The slug we computed looks invalid: ${slug}.
Maybe your slug frontmatter is incorrect or you use weird chars in the file path?
By using the slug frontmatter, you should be able to fix this error, by using the slug of your choice:

Example =>
---
slug: /my/customDocPath
---
`,
    );
  }

  return slug;
}
