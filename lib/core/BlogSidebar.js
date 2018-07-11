/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const Container = require('./Container.js');
const SideNav = require('./nav/SideNav.js');

const MetadataBlog = require('./MetadataBlog.js');

class BlogSidebar extends React.Component {
  render() {
    let blogSidebarCount = 5;
    const blogSidebarTitleConfig = this.props.config.blogSidebarTitle || {};
    let blogSidebarTitle = blogSidebarTitleConfig.default || 'Recent Posts';
    if (this.props.config.blogSidebarCount) {
      if (this.props.config.blogSidebarCount === 'ALL') {
        blogSidebarCount = MetadataBlog.length;
        blogSidebarTitle = blogSidebarTitleConfig.all || 'All Blog Posts';
      } else {
        blogSidebarCount = this.props.config.blogSidebarCount;
      }
    }

    const contents = [
      {
        name: blogSidebarTitle,
        links: MetadataBlog.slice(0, blogSidebarCount),
      },
    ];
    const title = this.props.current && this.props.current.title;

    const current = {
      id: title || '',
      category: blogSidebarTitle,
    };
    return (
      <Container className="docsNavContainer" id="docsNav" wrapper={false}>
        <SideNav
          language={this.props.language}
          root={`${this.props.config.baseUrl}blog/`}
          title="Blog"
          contents={contents}
          current={current}
        />
      </Container>
    );
  }
}

module.exports = BlogSidebar;
