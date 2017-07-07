/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const Marked = require('./Marked.js');
const React = require('react');

class BlogPost extends React.Component {
  renderContent() {
    let content = this.props.content;
    if (this.props.truncate) {
      content = content.split('<!--truncate-->')[0];
      return (
        <article className="post-content">
          <Marked>{content}</Marked>
          <div className="read-more">
            <a className="button" href={this.props.config.baseUrl + 'blog/' + this.props.post.path}>
              Read More
            </a>
          </div>
        </article>
      );
    }
    return <Marked>{content}</Marked>;
  }

  renderAuthorPhoto() {
    const post = this.props.post;
    if (post.authorFBID) {
      return (
        <div className="authorPhoto">
          <a href={post.authorURL} target="_blank">
            <img
              src={
                'https://graph.facebook.com/' +
                  post.authorFBID +
                  '/picture/?height=200&width=200'
              }
            />
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
        <a href={this.props.config.baseUrl + 'blog/' + post.path}>{post.title}</a>
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
        {this.renderAuthorPhoto()}
        <p className="post-authorName">
          <a href={post.authorURL} target="_blank">{post.author}</a>
        </p>
        {this.renderTitle()}
        <p className="post-meta">
          {month} {day}, {year}
        </p>
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
