/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ComponentType} from 'react';
import React from 'react';
import clsx from 'clsx';
import Link, {type Props as LinkProps} from '@docusaurus/Link';

import type {Props} from '@theme/BlogPostItem/Header/Author';
import Twitter from '@theme/Icon/Socials/Twitter';
import Github from '@theme/Icon/Socials/Github';
import X from '@theme/Icon/Socials/X';
import StackOverflow from '@theme/Icon/Socials/StackOverflow';
import LinkedIn from '@theme/Icon/Socials/LinkedIn';
import DefaultSocialIcon from '@theme/Icon/Socials/Default';
import styles from './styles.module.css';

function MaybeLink(props: LinkProps): JSX.Element {
  if (props.href) {
    return <Link {...props} />;
  }
  return <>{props.children}</>;
}

const PlatformIconsMap: Record<string, ComponentType<{className: string}>> = {
  twitter: Twitter,
  github: Github,
  stackoverflow: StackOverflow,
  linkedin: LinkedIn,
  x: X,
};

function SocialLink({platform, link}: {platform: string; link: string}) {
  const Icon = PlatformIconsMap[platform] ?? DefaultSocialIcon;
  return (
    <Link className={styles.authorSocialLink} href={link} title={platform}>
      <Icon className={clsx(styles.authorSocialLink)} />
    </Link>
  );
}

function AuthorSocials({author}: {author: Props['author']}) {
  return <div className={styles.authorSocials}>
    {Object.entries(author.socials ?? {}).map(([platform, linkUrl]) => {
      return <SocialLink key={platform} platform={platform} link={linkUrl} />;
    })}
  </div>
}

function AuthorTitle({title}: {title: string}) {
  return (
    <small className={styles.authorTitle} title={title}>
      {title}
    </small>
  );
}

export default function BlogPostItemHeaderAuthor({
  // singleAuthor,
  author,
  className,
}: Props): JSX.Element {
  const {name, title, url, socials, imageURL, email} = author;
  const link = url || (email && `mailto:${email}`) || undefined;

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
