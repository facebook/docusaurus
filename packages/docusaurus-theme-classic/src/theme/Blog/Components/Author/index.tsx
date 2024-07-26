/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Link, {type Props as LinkProps} from '@docusaurus/Link';
import AuthorSocials from '@theme/Blog/Components/Author/Socials';
import type {Props} from '@theme/Blog/Components/Author';
import Heading from '@theme/Heading';
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

function AuthorName({name, as}: {name: string; as: Props['as']}) {
  if (!as) {
    return <span className={styles.authorName}>{name}</span>;
  } else {
    return (
      <Heading as={as} className={styles.authorName}>
        {name}
      </Heading>
    );
  }
}

export default function BlogAuthor({
  as,
  author,
  className,
  count,
}: Props): JSX.Element {
  const {name, title, url, socials, imageURL, email, page} = author;
  const link =
    page?.permalink || url || (email && `mailto:${email}`) || undefined;

  const hasSocials = socials && Object.keys(socials).length > 0;

  return (
    <div
      className={clsx(
        'avatar margin-bottom--sm',
        className,
        styles[`author-as-${as}`],
      )}>
      {imageURL && (
        <MaybeLink href={link} className="avatar__photo-link">
          <img
            className={clsx('avatar__photo', styles.avatarImage)}
            src={imageURL}
            alt={name}
          />
        </MaybeLink>
      )}

      {(name || title) && (
        <div className="avatar__intro">
          <div className="avatar__name">
            {name && (
              <MaybeLink href={link}>
                <AuthorName name={name} as={as} />
              </MaybeLink>
            )}
            {count && <span className={clsx(styles.count)}>{count}</span>}
          </div>
          {!!title && <AuthorTitle title={title} />}
          {hasSocials && <AuthorSocials author={author} />}
        </div>
      )}
    </div>
  );
}
