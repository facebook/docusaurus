/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useBlogPost} from '@docusaurus/theme-common/internal';
import ChangelogAuthors from '@theme/ChangelogAuthors';

import BlogPostItemHeaderTitle from '@theme/BlogPostItem/Header/Title';
import BlogPostItemHeaderDate from '@theme/BlogPostItem/Header/Date';

import styles from './styles.module.css';

// Reduce changelog title size, but only on list view
function ChangelogTitle() {
  const {isBlogPostPage} = useBlogPost();
  return (
    <BlogPostItemHeaderTitle
      className={isBlogPostPage ? undefined : styles.changelogItemTitleList}
    />
  );
}

export default function ChangelogItemHeader(): JSX.Element {
  const {assets, metadata} = useBlogPost();
  const {authors} = metadata;
  return (
    <header>
      <ChangelogTitle />
      <BlogPostItemHeaderDate />
      <ChangelogAuthors authors={authors} assets={assets} />
    </header>
  );
}
