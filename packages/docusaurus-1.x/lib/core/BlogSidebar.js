/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const SideNav = require('./nav/SideNav.js');

const MetadataBlog = require('./MetadataBlog.js');

const MetadataPublicBlog =
  process.env.NODE_ENV === 'development'
    ? MetadataBlog
    : MetadataBlog.filter(item => !item.unlisted);

class BlogSidebar extends React.Component {
  render() {
    let blogSidebarCount = 5;
    const blogSidebarTitleConfig = this.props.config.blogSidebarTitle || {};
    let blogSidebarTitle = blogSidebarTitleConfig.default || 'Recent Posts';
    if (this.props.config.blogSidebarCount) {
      if (this.props.config.blogSidebarCount === 'ALL') {
        blogSidebarCount = MetadataPublicBlog.length;
        blogSidebarTitle = blogSidebarTitleConfig.all || 'All Blog Posts';
      } else {
        blogSidebarCount = this.props.config.blogSidebarCount;
      }
    }

    const contents = [
      {
        type: 'CATEGORY',
        title: blogSidebarTitle,
        children: MetadataPublicBlog.slice(0, blogSidebarCount).map(item => ({
          type: 'LINK',
          item,
        })),
      },
    ];
    const title = this.props.current && this.props.current.title;

    const current = {
      id: title || '',
      category: blogSidebarTitle,
    };
    return (
      <div className="docsNavContainer" id="docsNav">
        <SideNav
          language={this.props.language}
          root={`${this.props.config.baseUrl}blog/`}
          title="Blog"
          contents={contents}
          current={current}
        />
      </div>
    );
  }
}

module.exports = BlogSidebar;
