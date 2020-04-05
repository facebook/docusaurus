/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const siteConfig = require(`${process.cwd()}/siteConfig.js`);
const {getTOC} = require('../toc');

const Link = ({hashLink, content}) => (
  <a
    href={`#${hashLink}`}
    dangerouslySetInnerHTML={{
      __html: content,
    }}
  />
);

const Headings = ({headings}) => {
  if (!headings.length) return null;
  return (
    <ul className="toc-headings">
      {headings.map(heading => (
        <li key={heading.hashLink}>
          <Link hashLink={heading.hashLink} content={heading.content} />
          <Headings headings={heading.children} />
        </li>
      ))}
    </ul>
  );
};

class OnPageNav extends React.Component {
  render() {
    const customTags = siteConfig.onPageNavHeadings;
    const headings = customTags
      ? getTOC(this.props.rawContent, customTags.topLevel, customTags.sub)
      : getTOC(this.props.rawContent);

    return <Headings headings={headings} />;
  }
}

module.exports = OnPageNav;
