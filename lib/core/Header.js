/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const toSlug = require('./toSlug.js');

class Header extends React.Component {
  render() {
    const slug = toSlug(this.props.toSlug || this.props.children);
    const Heading = 'h' + this.props.level;

    return (
      <Heading {...this.props}>
        <a className="anchor" name={slug} />
        {this.props.children}{' '}
        <a className="hash-link" href={'#' + slug}>
          #
        </a>
      </Heading>
    );
  }
}

module.exports = Header;
