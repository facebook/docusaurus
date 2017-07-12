/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require("react");
const Container = require("./Container.js");
const SideNav = require("./nav/SideNav.js");

const MetadataBlog = require("./MetadataBlog.js");

class BlogSidebar extends React.Component {
  render() {
    const contents = [
      {
        name: "Recent Posts",
        links: MetadataBlog
      }
    ];
    const title = this.props.current && this.props.current.title;
    const current = {
      id: title || "",
      category: "Recent Posts"
    };
    return (
      <Container className="docsNavContainer" id="docsNav" wrapper={false}>
        <SideNav
          language={this.props.language}
          root={this.props.config.baseUrl + "blog/"}
          title="Blog"
          contents={contents}
          current={current}
        />
      </Container>
    );
  }
}

module.exports = BlogSidebar;
