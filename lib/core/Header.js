/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require("react");
const toSlug = require("./toSlug.js");

const Header = React.createClass({
  render() {
    const slug = toSlug(this.props.toSlug || this.props.children);
    const Heading = "h" + this.props.level;

    return (
      <Heading {...this.props}>
        <a className="anchor" name={slug} />
        {this.props.children}{" "}
        <a className="hash-link" href={"#" + slug}>
          #
        </a>
      </Heading>
    );
  }
});

module.exports = Header;
