/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const MarkdownBlock = require('./MarkdownBlock.js');
const utils = require('./utils.js');

// inner blog component for the article itself, without sidebar/header/footer
class BlogPost extends React.Component {
  renderContent() {
    if (this.props.truncate) {
      return (
        <article className="post-content">
          <MarkdownBlock>
            {utils.extractBlogPostBeforeTruncate(this.props.content)}
          </MarkdownBlock>
          {utils.blogPostHasTruncateMarker(this.props.content) && (
            <div className="read-more">
              <a
                className="button"
                href={`${this.props.config.baseUrl}blog/${utils.getPath(
                  this.props.post.path,
                  this.props.config.cleanUrl,
                )}`}>
                Read More
              </a>
            </div>
          )}
        </article>
      );
    }
    return <MarkdownBlock>{this.props.content}</MarkdownBlock>;
  }

  renderAuthorPhoto() {
    const post = this.props.post;
    const className = `authorPhoto${
      post.author && post.authorTitle ? ' authorPhotoBig' : ''
    }`;
    if (post.authorFBID || post.authorImageURL) {
      const authorImageURL = post.authorFBID
        ? `https://graph.facebook.com/${
            post.authorFBID
          }/picture/?height=200&width=200`
        : post.authorImageURL;
      return (
        <div className={className}>
          <a href={post.authorURL} target="_blank" rel="noreferrer noopener">
            <img src={authorImageURL} alt={post.author} />
          </a>
        </div>
      );
    }
    return null;
  }

  renderTitle() {
    const post = this.props.post;
    return (
      <h1 className="postHeaderTitle">
        <a
          href={`${this.props.config.baseUrl}blog/${utils.getPath(
            post.path,
            this.props.config.cleanUrl,
          )}`}>
          {post.title}
        </a>
      </h1>
    );
  }

  renderPostHeader() {
    const post = this.props.post;
    const match = post.path.match(/([0-9]+)\/([0-9]+)\/([0-9]+)/);
    // Because JavaScript sucks at date handling :(
    const year = match[1];
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
    ][parseInt(match[2], 10) - 1];
    const day = parseInt(match[3], 10);

    return (
      <header className="postHeader">
        {this.renderTitle()}
        <p className="post-meta">
          {month} {day}, {year}
        </p>
        <div className="authorBlock">
          {post.author ? (
            <p className="post-authorName">
              <a
                href={post.authorURL}
                target="_blank"
                rel="noreferrer noopener">
                {post.author}
              </a>
              {post.authorTitle}
            </p>
          ) : null}
          {this.renderAuthorPhoto()}
        </div>
      </header>
    );
  }

  render() {
    return (
      <div className="post">
        {this.renderPostHeader()}
        {this.renderContent()}
      </div>
    );
  }
}

module.exports = BlogPost;
