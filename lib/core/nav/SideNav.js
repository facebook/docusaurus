/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require("react");
const classNames = require("classnames");

const siteConfig = require(process.cwd() + "/siteConfig.js");
const translation = require("../../server/translation.js");

class SideNav extends React.Component {
  render() {
    return (
      <nav className="toc">
        <div className="toggleNav">
          <section className="navWrapper wrapper">
            <div className="navBreadcrumb wrapper">
              <div className="navToggle" id="navToggler">
                <i />
              </div>
              <h2>
                <i>›</i>
                <span>
                  {this.props.current.category}
                </span>
              </h2>
            </div>
            <div className="navGroups">
              {this.props.contents.map(this.renderCategory, this)}
            </div>
          </section>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          var toggler = document.getElementById('navToggler');
          var nav = document.getElementById('docsNav');
          toggler.onclick = function() {
            nav.classList.toggle('docsSliderActive');
          };
        `
          }}
        />
      </nav>
    );
  }
  renderCategory(category) {
    return (
      <div className="navGroup navGroupActive" key={category.name}>
        <h3>
          {this.getLocalizedCategoryString(category.name)}
        </h3>
        <ul>
          {category.links.map(this.renderItemLink, this)}
        </ul>
      </div>
    );
  }
  getLocalizedCategoryString(category) {
    let categoryString = translation[this.props.language]
      ? translation[this.props.language]["localized-strings"][category] ||
        category
      : category;
    return categoryString;
  }
  getLocalizedString(metadata) {
    let localizedString;
    if (metadata.sidebar_title) {
      localizedString = translation[this.props.language]
        ? translation[this.props.language]["localized-strings"][
            metadata.sidebar_title
          ] || metadata.sidebar_title
        : metadata.sidebar_title;
    } else {
      localizedString = translation[this.props.language]
        ? translation[this.props.language]["localized-strings"][
            metadata.localized_id
          ] || metadata.title
        : metadata.title;
    }
    return localizedString;
  }
  getLink(metadata) {
    if (metadata.permalink) {
      if (metadata.permalink.match(/^https?:/)) {
        return metadata.permalink;
      }
      return siteConfig.baseUrl + metadata.permalink + "#content";
    }
    if (metadata.path) {
      return siteConfig.baseUrl + "blog/" + metadata.path;
    }
    return null;
  }
  renderItemLink(link) {
    const itemClasses = classNames("navListItem", {
      navListItemActive: link.id === this.props.current.id
    });
    const linkClasses = classNames("navItem", {
      navItemActive: link.id === this.props.current.id
    });
    return (
      <li className={itemClasses} key={link.id}>
        <a className={linkClasses} href={this.getLink(link)}>
          {this.getLocalizedString(link)}
        </a>
      </li>
    );
  }
}
SideNav.defaultProps = {
  contents: []
};
module.exports = SideNav;
