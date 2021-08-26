/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';

function Year(/** @type {{ year: string; posts: BlogPost[]}} */ {year, posts}) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <h3>{year}</h3>
      <ul>
        {posts.map((post) => (
          <li key={post.metadata.date}>
            <Link to={post.metadata.permalink}>
              {post.metadata.formattedDate} - {post.metadata.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlogArchive({archiveData}) {
  const postsByYear = archiveData.reduceRight((posts, post) => {
    const year = post.metadata.date.split('-')[0];
    const yearPosts = posts.get(year) || [];
    return posts.set(year, [post, ...yearPosts]);
  }, /** @type {Map<string, BlogPost[]>}>} */ new Map());

  const yearsOfPosts = Array.from(postsByYear, ([year, posts]) => ({
    year,
    posts,
  }));

  return (
    <Layout title="Archive">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">Archive</h1>
          <p className="hero__subtitle">All Posts</p>
        </div>
      </header>
      <main>
        {yearsOfPosts && yearsOfPosts.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {yearsOfPosts.map((_props, idx) => (
                  <Year key={idx} {..._props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default BlogArchive;
