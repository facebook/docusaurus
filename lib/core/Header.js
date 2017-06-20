const React = require('react');
const toSlug = require('./toSlug.js');

const Header = React.createClass({
  render() {
    const slug = toSlug(this.props.toSlug || this.props.children);
    const Heading = 'h' + this.props.level;

    return (
      <Heading {...this.props}>
        <a className="anchor" name={slug}></a>
        {this.props.children}
        {' '}<a className="hash-link" href={'#' + slug}>#</a>
      </Heading>
    );
  },
});

module.exports = Header;
