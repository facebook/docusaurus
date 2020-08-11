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

export default function getSlug({
  baseID,
  frontmatterSlug,
  dirName,
}: {
  baseID: string;
  frontmatterSlug?: string;
  dirName: string;
}) {
  const baseSlug: string = frontmatterSlug || baseID;
  let slug: string;
  if (baseSlug.startsWith('/')) {
    slug = baseSlug;
  } else {
    const resolveDirname =
      dirName === '.'
        ? '/'
        : addLeadingSlash(addTrailingSlash(encodeURI(dirName)));
    slug = resolvePathname(encodeURI(baseSlug), resolveDirname);
  }

  if (!isValidPathname(slug)) {
    throw new Error(
      `Unable to resolve valid document slug. Maybe your slug frontmatter is incorrect? Doc id=${baseID} / dirName=${dirName} / frontmatterSlug=${frontmatterSlug} => bad result slug=${slug}`,
    );
  }

  return slug;
}
