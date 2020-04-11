/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

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

function BlogListPage(props) {
  const {
    children,
    frontMatter,
    metadata,
    isBlogPostPage,
    truncated
  } = props;

  const {date, permalink, tags, readingTime} = metadata;
  const {author, title} = frontMatter;

  const authorURL = frontMatter.author_url || frontMatter.authorURL;
  const authorTitle = frontMatter.author_title || frontMatter.authorTitle;
  const authorImageURL =
    frontMatter.author_image_url || frontMatter.authorImageURL;

  const match = date.substring(0, 10).split('-');
  const year = match[0];
  const month = MONTHS[parseInt(match[1], 10) - 1];
  const day = parseInt(match[2], 10);

  return (
    <article>
      <div className="card h-100">
        <div className="row no-gutters rows-col-2 m-3">
          <div className="col-xs mr-3">
            {authorImageURL && (
              <img
                style={{width: '50px'}}
                src={authorImageURL}
                alt={author}
              />
            )}
          </div>
          <div className="col">
            {author && (<h5>{author}</h5>)}
            <time
              className="card-subtitle mb-md-4 font-weight-light"
              dateTime={date}
            >
              {month} {day}, {year}{' '}
            </time>
          </div>
        </div>

        <div className="card-body">
          <h3 className="card-title text-primary">{title}</h3>
          <p className="lead">Markdown content</p>
        </div>

        <div className="text-right m-3">
          {readingTime && (
            <small className={truncated ? "mx-3" : ''}>
              {Math.ceil(readingTime)} min read
            </small> 
          )}
          {truncated && (
            <a href="https://github.com/" className="stretched-link">
              Read more
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default BlogListPage;
