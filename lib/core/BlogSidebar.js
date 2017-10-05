/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
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
        links: MetadataBlog.slice(0, 5)
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
