/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import classnames from 'classnames';
import Layout from '@theme/Layout'; // eslint-disable-line

import DocusaurusContext from '@docusaurus/context';

import styles from './styles.module.css';

class BlogPost extends React.Component {
  renderPostHeader() {
    const {metadata} = this.context;
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
      <header className={styles.postHeader}>
        <h1 className={styles.postHeaderTitle}>
          <Link to={permalink}>{title}</Link>
        </h1>
        <p className={styles.postMeta}>
          {month[blogPostDate.getMonth()]} {blogPostDate.getDay()},{' '}
          {blogPostDate.getFullYear()}
        </p>
        <div className={styles.authorBlock}>
          {author ? (
            <p className={styles.authorName}>
              <a href={authorURL} target="_blank" rel="noreferrer noopener">
                {author}
              </a>
              {authorTitle}
            </p>
          ) : null}
          {authorImageURL && (
            <div
              className={classnames(styles.authorPhoto, {
                [styles.authorPhotoBig]: author && authorTitle,
              })}>
              <a href={authorURL} target="_blank" rel="noreferrer noopener">
                <img src={authorImageURL} alt={author} />
              </a>
            </div>
          )}{' '}
        </div>
      </header>
    );
  }

  render() {
    const {metadata = {}, siteConfig = {}} = this.context;
    const {baseUrl, favicon} = siteConfig;
    const {language, title} = metadata;
    const {modules} = this.props;
    const BlogPostContents = modules[0];

    return (
      <Layout>
        <Head defaultTitle={siteConfig.title}>
          {title && <title>{title}</title>}
          {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
          {language && <html lang={language} />}
        </Head>
        {this.renderPostHeader()}
        <BlogPostContents />
      </Layout>
    );
  }
}

BlogPost.contextType = DocusaurusContext;

export default BlogPost;
