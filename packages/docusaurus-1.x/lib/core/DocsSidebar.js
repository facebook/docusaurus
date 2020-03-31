/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const fs = require('fs');
const SideNav = require('./nav/SideNav.js');
const Metadata = require('./core/metadata.js');

const readCategories = require('../server/readCategories.js');

let languages;

const CWD = process.cwd();
if (fs.existsSync(`${CWD}/languages.js`)) {
  languages = require(`${CWD}/languages.js`);
} else {
  languages = [
    {
      enabled: true,
      name: 'English',
      tag: 'en',
    },
  ];
}

class DocsSidebar extends React.Component {
  render() {
    const {category, sidebar} = this.props.metadata;
    const docsCategories = readCategories(sidebar, Metadata, languages);

    if (!category) {
      return null;
    }

    return (
      <div className="docsNavContainer" id="docsNav">
        <SideNav
          collapsible={this.props.collapsible}
          language={this.props.metadata.language}
          root={this.props.root}
          title={this.props.title}
          contents={docsCategories[this.props.metadata.language]}
          current={this.props.metadata}
        />
      </div>
    );
  }
}

module.exports = DocsSidebar;
