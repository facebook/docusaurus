/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Marked = require("./Marked.js");
const React = require("react");

// inner blog component for the article itself, without sidebar/header/footer
class BlogPost extends React.Component {
  renderContent() {
    let content = this.props.content;
    if (this.props.truncate) {
      content = content.split("<!--truncate-->")[0];
      return (
        <article className="post-content">
          <Marked>{content}</Marked>
          <div className="read-more">
            <a
              className="button"
              href={this.props.config.baseUrl + "blog/" + this.props.post.path}>
              Read More
            </a>
          </div>
        </article>
      );
    }
    return <Marked>{content}</Marked>;
  }

  renderAuthorPhoto() {
    const post = this.props.post;
    const className =
      "authorPhoto" +
      (post.author && post.authorTitle ? " authorPhoto-big" : "");
    if (post.authorFBID) {
      return (
        <div className={className}>
          <a href={post.authorURL} target="_blank">
            <img
              src={
                "https://graph.facebook.com/" +
                post.authorFBID +
                "/picture/?height=200&width=200"
              }
            />
          </a>
        </div>
      );
    } else if (post.authorImage) {
      return (
        <div className={className}>
          <a href={post.authorURL} target="_blank">
            <img src={post.authorImage} />
          </a>
        </div>
      );
    } else {
      return null;
    }
  }

  renderTitle() {
    const post = this.props.post;
    return (
      <h1>
        <a href={this.props.config.baseUrl + "blog/" + post.path}>
          {post.title}
        </a>
      </h1>
    );
  }

  renderPostHeader() {
    const post = this.props.post;
    const match = post.path.match(/([0-9]+)\/([0-9]+)\/([0-9]+)/);
    // Because JavaScript sucks at date handling :(
    const year = match[1];
    const month = ("00" + parseInt(match[2], 10).toString()).slice(-2);
    const day = ("00" + parseInt(match[3], 10).toString()).slice(-2);

    // Blog post dates are presented as raw YYYY-MM-DD text, and dynamically
    // localized on page load using moment.js
    return (
      <header className="postHeader">
        {this.renderTitle()}
        <p className="post-meta blog-post-date blog-post-date-process">
          {year + "-" + month + "-" + day}
        </p>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var blogDateObjects = document.getElementsByClassName('blog-post-date-process');
                var locale = window.navigator.userLanguage || window.navigator.language;
              if(blogDateObjects.length > 0) {
                for (var i = blogDateObjects.length - 1; i >= 0; i--) {
                  var blogDate = blogDateObjects[i].innerHTML.trim();
                  moment.locale("en-US");
                  blogDateObjects[i].innerHTML = moment(blogDate, "YYYY-MM-DD").locale(locale).format("LL").toString();
                  // don't process this date again
                  blogDateObjects[i].classList.remove("blog-post-date-process")
                }
              }
            `
          }}
        />

        <div className="authorBlock">
          {post.author ? (
            <p className="post-authorName">
              <a href={post.authorURL} target="_blank">
                {post.author}
              </a>
              {post.authorTitle}
            </p>
          ) : null}
          {this.renderAuthorPhoto()}
        </div>
      </header>
    );
  }

  render() {
    return (
      <div className="post">
        {this.renderPostHeader()}
        {this.renderContent()}
      </div>
    );
  }
}

module.exports = BlogPost;
