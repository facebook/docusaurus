/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Link, {type Props as LinkProps} from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/theme-common/internal';
import type {Props} from '@theme/BlogPostItem/Header/Author';

function MaybeLink(props: LinkProps): JSX.Element {
  if (props.href) {
    return <Link {...props} />;
  }
  return <>{props.children}</>;
}

export default function BlogPostItemHeaderAuthor({
  author,
  className,
}: Props): JSX.Element {
  const {name, key, title, url, imageURL, email} = author;
  const {
    metadata: {pageAuthors},
  } = useBlogPost();

  const authorPermalink = pageAuthors.find(
    (pageAuthor) => pageAuthor.name === name || pageAuthor.key === key,
  )?.permalink;

  const link =
    authorPermalink || url || (email && `mailto:${email}`) || undefined;

  return (
    <div className={clsx('avatar margin-bottom--sm', className)}>
      {imageURL && (
        <MaybeLink href={link} className="avatar__photo-link">
          <img className="avatar__photo" src={imageURL} alt={name} />
        </MaybeLink>
      )}

      {name && (
        <div className="avatar__intro">
          <div className="avatar__name">
            <MaybeLink href={link}>
              <span>{name}</span>
            </MaybeLink>
          </div>
          <small className="avatar__subtitle">{title}</small>
        </div>
      )}
    </div>
  );
}
