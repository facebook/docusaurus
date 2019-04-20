/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';

function Post(props) {
  const {metadata, children, truncated} = props;
  const renderPostHeader = () => {
    if (!metadata) {
      return null;
    }
    const {
      date,
      author,
      authorURL,
      authorTitle,
      authorFBID,
      permalink,
      title,
    } = metadata;

    const blogPostDate = new Date(date);
    const month = [
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
    const authorImageURL = authorFBID
      ? `https://graph.facebook.com/${authorFBID}/picture/?height=200&width=200`
      : metadata.authorImageURL;

    return (
      <header>
        <h1>
          <Link to={permalink}>{title}</Link>
        </h1>
        <div className="margin-bottom--sm">
          {month[blogPostDate.getMonth()]} {blogPostDate.getDay()},{' '}
          {blogPostDate.getFullYear()}
        </div>
        <div className="avatar margin-bottom--md">
          {authorImageURL && (
            <a
              className="avatar__photo-link"
              href={authorURL}
              target="_blank"
              rel="noreferrer noopener">
              <img
                className="avatar__photo"
                src={authorImageURL}
                alt={author}
              />
            </a>
          )}
          <div className="avatar__intro">
            {author && (
              <>
                <h4 className="avatar__name">
                  <a href={authorURL} target="_blank" rel="noreferrer noopener">
                    {author}
                  </a>
                </h4>
                <small className="avatar__subtitle">{authorTitle}</small>
              </>
            )}
          </div>
        </div>
      </header>
    );
  };

  return (
    <div>
      {renderPostHeader()}
      {children}
      {truncated && (
        <div className="text--right">
          <Link className="button button--secondary" to={metadata.permalink}>
            Read More
          </Link>
        </div>
      )}
    </div>
  );
}

export default Post;
