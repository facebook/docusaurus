/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ComponentType} from 'react';
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/Blog/Components/Author/Socials';

import Twitter from '@theme/Icon/Socials/Twitter';
import GitHub from '@theme/Icon/Socials/GitHub';
import X from '@theme/Icon/Socials/X';
import StackOverflow from '@theme/Icon/Socials/StackOverflow';
import LinkedIn from '@theme/Icon/Socials/LinkedIn';
import DefaultSocialIcon from '@theme/Icon/Socials/Default';

import styles from './styles.module.css';

type SocialIcon = ComponentType<{className: string}>;

type SocialPlatformConfig = {Icon: SocialIcon; label: string};

const SocialPlatformConfigs: Record<string, SocialPlatformConfig> = {
  twitter: {Icon: Twitter, label: 'Twitter'},
  github: {Icon: GitHub, label: 'GitHub'},
  stackoverflow: {Icon: StackOverflow, label: 'Stack Overflow'},
  linkedin: {Icon: LinkedIn, label: 'LinkedIn'},
  x: {Icon: X, label: 'X'},
};

function getSocialPlatformConfig(platformKey: string): SocialPlatformConfig {
  return (
    SocialPlatformConfigs[platformKey] ?? {
      Icon: DefaultSocialIcon,
      label: platformKey,
    }
  );
}

function SocialLink({platform, link}: {platform: string; link: string}) {
  const {Icon, label} = getSocialPlatformConfig(platform);
  return (
    <Link className={styles.authorSocialLink} href={link} title={label}>
      <Icon className={clsx(styles.authorSocialLink)} />
    </Link>
  );
}

export default function BlogAuthorSocials({
  author,
}: {
  author: Props['author'];
}): JSX.Element {
  const entries = Object.entries(author.socials ?? {});
  return (
    <div className={styles.authorSocials}>
      {entries.map(([platform, linkUrl]) => {
        return <SocialLink key={platform} platform={platform} link={linkUrl} />;
      })}
    </div>
  );
}
