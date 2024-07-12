/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Link, {type Props as LinkProps} from '@docusaurus/Link';
import AuthorSocials from '@theme/BlogPostItem/Header/Author/Socials';

import type {Props} from '@theme/BlogPostItem/Header/Author';
import styles from './styles.module.css';

function MaybeLink(props: LinkProps): JSX.Element {
  if (props.href) {
    return <Link {...props} />;
  }
  return <>{props.children}</>;
}

function AuthorTitle({title}: {title: string}) {
  return (
    <small className={styles.authorTitle} title={title}>
      {title}
    </small>
  );
}

export default function BlogPostItemHeaderAuthor({
  // singleAuthor, // may be useful in the future, or for swizzle users
  author,
  className,
}: Props): JSX.Element {
  const {name, title, url, socials, imageURL, email, page} = author;
  const link =
    page?.permalink || url || (email && `mailto:${email}`) || undefined;

  const hasSocials = socials && Object.keys(socials).length > 0;

  return (
    <div className={clsx('avatar margin-bottom--sm', className)}>
      {imageURL && (
        <MaybeLink href={link} className="avatar__photo-link">
          <img className="avatar__photo" src={imageURL} alt={name} />
        </MaybeLink>
      )}

      {(name || title) && (
        <div className="avatar__intro">
          <div className="avatar__name">
            <MaybeLink href={link}>
              <span className={styles.authorName}>{name}</span>
            </MaybeLink>
          </div>
          {!!title && <AuthorTitle title={title} />}
          {hasSocials && <AuthorSocials author={author} />}
        </div>
      )}
    </div>
  );
}
