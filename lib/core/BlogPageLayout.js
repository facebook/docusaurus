/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const BlogPost = require('./BlogPost.js');
const BlogSidebar = require('./BlogSidebar.js');
const Container = require('./Container.js');
const MetadataBlog = require('./MetadataBlog.js');
const React = require('react');
const Site = require('./Site.js');
const utils = require('./utils.js');

// used to generate entire blog pages, i.e. collection of truncated blog posts
class BlogPageLayout extends React.Component {
  getPageURL(page) {
    let url = this.props.config.baseUrl + 'blog/';
    if (page > 0) {
      url += 'page' + (page + 1) + '/';
    }
    return url;
  }

  render() {
    const perPage = this.props.metadata.perPage;
    const page = this.props.metadata.page;
    return (
      <Site
        title="Blog"
        language="en"
        config={this.props.config}
        className="blog"
        metadata={{blog: true, blogListing: true}}>
        <div className="docMainWrapper wrapper">
          <BlogSidebar
            language={this.props.language}
            config={this.props.config}
          />
          <Container className="mainContainer postContainer blogContainer">
            <div className="posts">
              {MetadataBlog.slice(page * perPage, (page + 1) * perPage).map(
                post => {
                  return (
                    <BlogPost
                      post={post}
                      content={post.content}
                      truncate={true}
                      key={
                        utils.getPath(post.path, this.props.config.cleanUrl) +
                        post.title
                      }
                      config={this.props.config}
                    />
                  );
                }
              )}
              <div className="docs-prevnext">
                {page > 0 && (
                  <a className="docs-prev" href={this.getPageURL(page - 1)}>
                    ← Prev
                  </a>
                )}
                {MetadataBlog.length > (page + 1) * perPage && (
                  <a className="docs-next" href={this.getPageURL(page + 1)}>
                    Next →
                  </a>
                )}
              </div>
            </div>
          </Container>
        </div>
      </Site>
    );
  }
}

module.exports = BlogPageLayout;
