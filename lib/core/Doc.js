const React = require('react');
const Marked = require('./Marked.js');

class Doc extends React.Component {
  render() {
    let editLink = (
      <a
        className="edit-page-link button"
        href={
          this.props.config.editUrl +
            this.props.language +
            '/' +
            this.props.source
        }
        target="_blank"
      >
        Edit this Doc
      </a>
    );
    return (
      <div className="post">
        <header className="postHeader">
          {editLink}
          <h1>{this.props.title}</h1>
        </header>
        <article>
          <Marked>{this.props.content}</Marked>
        </article>
      </div>
    );
  }
}

module.exports = Doc;