/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const Metadata = require("./metadata.js");
const React = require("react");
const Container = require("./Container.js");
const SideNav = require("./nav/SideNav.js");
const siteConfig = require(process.cwd() + "/siteConfig.js");

class DocsSidebar extends React.Component {
  render() {
    let layout = this.props.metadata.layout;
    let docsCategories = require("./" + layout + "Categories.js");
    return (
      <Container className="docsNavContainer" id="docsNav" wrapper={false}>
        <SideNav
          language={this.props.metadata.language}
          root={this.props.root}
          title={this.props.title}
          contents={docsCategories[this.props.metadata.language]}
          current={this.props.metadata}
        />
      </Container>
    );
  }
}

DocsSidebar.propTypes = {
  layout: React.PropTypes.string,
  root: React.PropTypes.string,
  title: React.PropTypes.string
};

DocsSidebar.defaultProps = siteConfig.docsSidebarDefaults;

module.exports = DocsSidebar;
