/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const getTOC = require('../getTOC');

const Link = ({hashLink, text}) => <a href={`#${hashLink}`}>{text}</a>;

const Headings = ({headings}) => {
  if (!headings.length) return null;
  return (
    <ul>
      {headings.map((heading, i) => (
        <li key={i}>
          <Link hashLink={heading.hashLink} text={heading.text} />
          <Headings headings={heading.children} />
        </li>
      ))}
    </ul>
  );
};

class OnPageNav extends React.Component {
  render() {
    const customTags = this.props.config.onPageNavHeadings;
    const headings = customTags
      ? getTOC(this.props.rawContent, customTags.topLevel, customTags.sub)
      : getTOC(this.props.rawContent);

    return (
      <nav className="onPageNav">
        <Headings headings={headings} />
      </nav>
    );
  }
}

module.exports = OnPageNav;
