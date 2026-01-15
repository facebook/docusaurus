/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';
import Translate from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';

import type {RecentBlogsPluginData} from '@site/src/plugins/recentBlogs';
import styles from './styles.module.css';

function BlogPostCard({
  title,
  permalink,
  date,
  description,
  authors,
}: {
  title: string;
  permalink: string;
  date: string;
  description: string;
  authors: ReadonlyArray<{name?: string; imageURL?: string}>;
}): ReactNode {
  return (
    <div className={clsx('col col--4')}>
      <article className={clsx('card', styles.blogCard)}>
        <div className="card__header">
          <Heading as="h3" className={styles.blogCardTitle}>
            <Link to={permalink}>{title}</Link>
          </Heading>
          <time dateTime={date} className={styles.blogCardDate}>
            {new Date(date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        <div className="card__body">
          <p className={styles.blogCardDescription}>{description}</p>
        </div>
        <div className="card__footer">
          <div className={styles.blogCardAuthors}>
            {authors.slice(0, 3).map((author, index) => (
              <div key={author.name ?? index} className={styles.blogCardAuthor}>
                {author.imageURL && (
                  <img
                    src={author.imageURL}
                    alt={author.name ?? 'Blog post author'}
                    className={styles.blogCardAuthorImage}
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>
          <Link to={permalink} className="button button--secondary button--sm">
            <Translate id="homepage.recentBlogs.readMore">Read more</Translate>
          </Link>
        </div>
      </article>
    </div>
  );
}

export default function RecentBlogs(): ReactNode {
  const {recentPosts} = usePluginData(
    'recent-blogs-plugin',
  ) as RecentBlogsPluginData;
  const blogUrl = useBaseUrl('/blog');

  if (!recentPosts || recentPosts.length === 0) {
    return null;
  }

  return (
    <section className={clsx(styles.recentBlogs, 'padding-vert--lg')}>
      <div className="container">
        <Heading as="h2" className={clsx('text--center', 'margin-bottom--lg')}>
          <Translate id="homepage.recentBlogs.title">Latest Blogs</Translate>
        </Heading>
        <div className="row">
          {recentPosts.map((post) => (
            <BlogPostCard key={post.permalink} {...post} />
          ))}
        </div>
        <div className={clsx('text--center', 'margin-top--lg')}>
          <Link to={blogUrl} className="button button--primary button--lg">
            <Translate id="homepage.recentBlogs.viewAll">
              View all blog posts
            </Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}
