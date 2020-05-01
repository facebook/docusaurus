/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import MDXComponents from '@theme/MDXComponents';
import Link from '@docusaurus/Link';

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

const getReadingTime = (readingTime) => {
  return Math.ceil(readingTime);
};

function BlogPostItem(props) {
  const {
    children,
    frontMatter,
    metadata,
    truncated,
    isBlogPostPage = false,
  } = props;

  const {date, readingTime, tags, permalink, editUrl} = metadata;
  const {author, title} = frontMatter;

  const authorURL = frontMatter.author_url || frontMatter.authorURL;
  const authorImageURL =
    frontMatter.author_image_url || frontMatter.authorImageURL;

  const match = date.substring(0, 10).split('-');
  const year = match[0];
  const month = MONTHS[parseInt(match[1], 10) - 1];
  const day = parseInt(match[2], 10);

  return (
    <article className="card shadow">
      <div className="row no-gutters rows-col-2 m-3">
        <div className="col-xs mr-3">
          {authorImageURL && (
            <img style={{width: '50px'}} src={authorImageURL} alt={author} />
          )}
        </div>
        <div className="col">
          {author && (
            <h5>
              <a href={authorURL} alt={author}>
                {author}
              </a>
            </h5>
          )}
          <time
            className="card-subtitle mb-md-4 font-weight-light"
            dateTime={date}>
            {month} {day}, {year}{' '}
            {isBlogPostPage && readingTime && (
              <> · {getReadingTime(readingTime)} min read</>
            )}
          </time>
        </div>
        <div className="col text-right">
          {isBlogPostPage && editUrl && (
            <span>
              <a href={editUrl} target="_blank" rel="noreferrer noopener">
                <svg
                  fill="currentColor"
                  height="1.2em"
                  width="1.2em"
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 40 40"
                  style={{
                    marginRight: '0.3em',
                    verticalAlign: 'sub',
                  }}>
                  <g>
                    <path d="m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z" />
                  </g>
                </svg>
                Edit this page
              </a>
            </span>
          )}
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title text-primary mr-2">{title}</h3>
        <section>
          <MDXProvider components={MDXComponents}>{children}</MDXProvider>
        </section>
      </div>

      <footer className="row no-gutters m-3 justify-content-between">
        <div className="col col-xs">
          {tags.length > 0 && (
            <>
              {tags.map(({label, permalink: tagPermalink}) => (
                <Link key={tagPermalink} className="m-1" to={tagPermalink}>
                  <span className="badge badge-primary">{label}</span>
                </Link>
              ))}
            </>
          )}
        </div>
        <div className="col align-self-center text-right">
          {!isBlogPostPage && readingTime && (
            <small className={truncated ? 'mr-2' : ''}>
              {getReadingTime(readingTime)} min read
            </small>
          )}
          {truncated && (
            <Link to={permalink} aria-label={`Read more about ${title}`}>
              <span className="stretched-link">Read more</span>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
}

export default BlogPostItem;
