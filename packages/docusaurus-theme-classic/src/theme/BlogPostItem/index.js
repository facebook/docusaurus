/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import classnames from 'classnames';
import {MDXProvider} from '@mdx-js/react';

import Link from '@docusaurus/Link';
import MDXComponents from '@theme/MDXComponents';

import styles from './styles.module.css';

function BlogPostItem(props) {
  const {children, frontMatter, metadata, truncated} = props;
  const {date, permalink, tags} = metadata;
  const {author, authorURL, authorTitle, authorFBID, title} = frontMatter;

  const renderPostHeader = () => {
    const match = date.substring(0, 10).split('-');
    const year = match[0];
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
    ][parseInt(match[1], 10) - 1];
    const day = parseInt(match[2], 10);

    const authorImageURL = authorFBID
      ? `https://graph.facebook.com/${authorFBID}/picture/?height=200&width=200`
      : frontMatter.authorImageURL;

    return (
      <header>
        <h1 className={classnames('margin-bottom--sm', styles.blogPostTitle)}>
          <Link to={permalink}>{title}</Link>
        </h1>
        <div className="margin-bottom--sm">
          <time dateTime={date} className={styles.blogPostDate}>
            {month} {day}, {year}
          </time>
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
      <article className="markdown">
        <MDXProvider components={MDXComponents}>{children}</MDXProvider>
      </article>
      {(tags.length > 0 || truncated) && (
        <div className="row margin-vert--lg">
          {tags.length > 0 && (
            <div className="col">
              <strong>Tags:</strong>
              {tags.map(({label, permalink: tagPermalink}) => (
                <Link
                  key={tagPermalink}
                  className="margin-horiz--sm"
                  to={tagPermalink}>
                  {label}
                </Link>
              ))}
            </div>
          )}
          {truncated && (
            <div className="col text--right">
              <Link to={metadata.permalink}>
                <strong>Read More</strong>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BlogPostItem;
