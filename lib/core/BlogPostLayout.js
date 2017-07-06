/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require('react');
const BlogPost = require('./BlogPost.js');
const BlogSidebar = require('./BlogSidebar.js');
const Container = require('./Container.js');
const Site = require('./Site.js');

class BlogPostLayout extends React.Component {
  render() {
    return (
      <Site
        className="sideNavVisible"
        section="blog"
        url={'blog/' + this.props.metadata.path}
        title={this.props.metadata.title}
        language={'en'}
        description={this.props.children.trim().split('\n')[0]}
        config={this.props.config}
      >
        <div className="docMainWrapper wrapper">
          <BlogSidebar language={'en'} current={this.props.metadata} config={this.props.config}/>
          <Container className="mainContainer documentContainer postContainer blogContainer">
            <div className="lonePost">
              <BlogPost
                post={this.props.metadata}
                content={this.props.children}
                language={'en'}
                config={this.props.config}
              />
            </div>
          </Container>
        </div>
      </Site>
    );
  }
}

module.exports = BlogPostLayout;
