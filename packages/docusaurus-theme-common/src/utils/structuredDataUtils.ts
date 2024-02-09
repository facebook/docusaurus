/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Author} from '@docusaurus/plugin-content-blog';

/** @returns A {@link https://schema.org/Person} constructed from the {@link Author} */
export function makePersonStructuredData(author: Author): object {
  return {
    '@type': 'Person',
    ...(author.name ? {name: author.name} : {}),
    ...(author.title ? {description: author.title} : {}),
    ...(author.url ? {url: author.url} : {}),
    ...(author.email ? {email: author.email} : {}),
    ...(author.imageURL ? {image: author.imageURL} : {}),
  };
}

/** @returns A {@link https://schema.org/ImageObject} */
export function makeImageStructuredData({
  imageUrl,
  caption,
}: {
  imageUrl: string;
  caption: string;
}): object {
  return {
    '@type': 'ImageObject',
    '@id': imageUrl,
    url: imageUrl,
    contentUrl: imageUrl,
    caption,
  };
}
