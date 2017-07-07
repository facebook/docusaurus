/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require('react');
const Marked = require('./Marked.js');

class Doc extends React.Component {
  render() {
    let editLink = (
      <a
        className="edit-page-link button"
        href={
          this.props.config.editUrl +
            this.props.language +
            '/' +
            this.props.source
        }
        target="_blank"
      >
        Edit this Doc
      </a>
    );
    return (
      <div className="post">
        <header className="postHeader">
          {editLink}
          <h1>{this.props.title}</h1>
        </header>
        <article>
          <Marked>{this.props.content}</Marked>
        </article>
      </div>
    );
  }
}

module.exports = Doc;
