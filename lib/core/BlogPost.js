/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const MarkdownBlock = require('./MarkdownBlock.js');
const React = require('react');

// inner blog component for the article itself, without sidebar/header/footer
class BlogPost extends React.Component {
  renderContent() {
    let content = this.props.content;
    let hasSplit = false;
    if (content.split('<!--truncate-->').length > 1) {
      hasSplit = (
        <div className="read-more">
          <a
            className="button"
            href={this.props.config.baseUrl + 'blog/' + this.props.post.path}>
            Read More
          </a>
        </div>
      );
    }
    if (this.props.truncate) {
      content = content.split('<!--truncate-->')[0];
      return (
        <article className="post-content">
          <MarkdownBlock>{content}</MarkdownBlock>
          {hasSplit}
        </article>
      );
    }
    return <MarkdownBlock>{content}</MarkdownBlock>;
  }

  renderAuthorPhoto() {
    const post = this.props.post;
    const className =
      'authorPhoto' +
      (post.author && post.authorTitle ? ' authorPhoto-big' : '');
    if (post.authorFBID) {
      return (
        <div className={className}>
          <a href={post.authorURL} target="_blank" rel="noreferrer noopener">
            <img
              src={
                'https://graph.facebook.com/' +
                post.authorFBID +
                '/picture/?height=200&width=200'
              }
              alt={post.author}
            />
          </a>
        </div>
      );
    } else if (post.authorImage) {
      return (
        <div className={className}>
          <a href={post.authorURL} target="_blank" rel="noreferrer noopener">
            <img src={post.authorImage} />
          </a>
        </div>
      );
    } else if (post.authorImageURL) {
      return (
        <div className={className}>
          <a href={post.authorURL} target="_blank" rel="noreferrer noopener">
            <img src={post.authorImageURL} />
          </a>
        </div>
      );
    } else {
      return null;
    }
  }

  renderTitle() {
    const post = this.props.post;
    return (
      <h1>
        <a href={this.props.config.baseUrl + 'blog/' + post.path}>
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
