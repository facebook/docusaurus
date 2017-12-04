/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const BlogPost = require('./BlogPost.js');
const BlogSidebar = require('./BlogSidebar.js');
const Container = require('./Container.js');
const Site = require('./Site.js');

// used for entire blog posts, i.e., each written blog article with sidebar with site header/footer
class BlogPostLayout extends React.Component {
  renderSocialButtons() {
    const post = this.props.metadata;

    const fbLike = this.props.config.facebookAppId ? (
      <div
        className="fb-like"
        data-layout="standard"
        data-share="true"
        data-width="225"
        data-show-faces="false"
      />
    ) : null;

    const twitterShare = this.props.config.twitter ? (
      <a
        href="https://twitter.com/share"
        className="twitter-share-button"
        data-text={post.title}
        data-url={
          this.props.config.url +
          this.props.config.baseUrl +
          'blog/' +
          post.path
        }
        data-related={this.props.config.twitter}
        data-via={post.authorTwitter}
        data-show-count="false">
        Tweet
      </a>
    ) : null;

    if (!fbLike && !twitterShare) {
      return;
    }

    return (
      <div>
        <aside className="entry-share">
          <div className="social-buttons">
            {fbLike}
            {twitterShare}
          </div>
        </aside>
      </div>
    );
  }

  render() {
    return (
      <Site
        className="sideNavVisible"
        url={'blog/' + this.props.metadata.path}
        title={this.props.metadata.title}
        language={'en'}
        description={this.props.children.trim().split('\n')[0]}
        config={this.props.config}>
        <div className="docMainWrapper wrapper">
          <BlogSidebar
            language={'en'}
            current={this.props.metadata}
            config={this.props.config}
          />
          <Container className="mainContainer documentContainer postContainer blogContainer">
            <div className="lonePost">
              <BlogPost
                post={this.props.metadata}
                content={this.props.children}
                language={'en'}
                config={this.props.config}
              />
              {this.renderSocialButtons()}
            </div>
            <div className="blog-recent">
              <a className="button" href={this.props.config.baseUrl + 'blog'}>
                Recent Posts
              </a>
            </div>
          </Container>
        </div>
      </Site>
    );
  }
}

module.exports = BlogPostLayout;
