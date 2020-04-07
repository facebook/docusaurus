/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {MDXProvider} from '@mdx-js/react';

import Link from '@docusaurus/Link';
import MDXComponents from '@theme/MDXComponents';

import styles from './styles.module.css';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function BlogPostItem(props) {
  const {
    children,
    frontMatter,
    metadata,
    truncated,
    isBlogPostPage = false,
  } = props;
  const {date, permalink, tags, readingTime} = metadata;
  const {author, title} = frontMatter;

  const authorURL = frontMatter.author_url || frontMatter.authorURL;
  const authorTitle = frontMatter.author_title || frontMatter.authorTitle;
  const authorImageURL =
    frontMatter.author_image_url || frontMatter.authorImageURL;

  const renderPostHeader = () => {
    const TitleHeading = isBlogPostPage ? 'h1' : 'h2';
    const match = date.substring(0, 10).split('-');
    const year = match[0];
    const month = MONTHS[parseInt(match[1], 10) - 1];
    const day = parseInt(match[2], 10);

    return (
      <header>
      <div className="card-header">
        <TitleHeading
          className="card-title">
          {isBlogPostPage ? title : <Link to={permalink}>{title}</Link>}
        </TitleHeading>
        <div className="card-subtitle mb-md text-muted">
          <time dateTime={date} className={styles.blogPostDate}>
            {month} {day}, {year}{' '}
            {readingTime && <> · {Math.ceil(readingTime)} min read</>}
          </time>
        </div>
        </div>
        <div className="row p-md-3">
        <div className="col col-1">
          {authorImageURL && (
            <a
              className="card-img-top"
              href={authorURL}
              target="_blank"
              rel="noreferrer noopener">
              <img
                className="rounded-circle"
                src={authorImageURL}
                alt={author}
                style={{width: '50px'}}
              />
            </a>
          )}
          </div>
          <div className="col">
            {author && (
              <>
                <h4 className="avatar__name">
                  <a href={authorURL} target="_blank" rel="noreferrer noopener">
                    {author}
                  </a>
                </h4>
                <small className="card-subtitle mb-4 text-muted">{authorTitle}</small>
              </>
            )}
          </div>
        </div>
      </header>
    );
  };

  return (
    <article className="card mb-md-5">
      {renderPostHeader()}
      <section className="card-body">
        <p className="card-text">
          <MDXProvider components={MDXComponents}>{children}</MDXProvider>
        </p>
      </section>
      {(tags.length > 0 || truncated) && (
        <footer className="row my-md-3 mx-1">
          {tags.length > 0 && (
            <div className="col">
              <strong>Tags:</strong>
              {tags.map(({label, permalink: tagPermalink}) => (
                <Link
                  key={tagPermalink}
                  className="mx-1"
                  to={tagPermalink}>
                  {label}
                </Link>
              ))}
            </div>
          )}
          {truncated && (
            <div className="col text-right">
              <Link
                to={metadata.permalink}
                aria-label={`Read more about ${title}`}>
                <strong>Read More</strong>
              </Link>
            </div>
          )}
        </footer>
      )}
    </article>
  );
}

export default BlogPostItem;
