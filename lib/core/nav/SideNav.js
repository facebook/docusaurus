/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const classNames = require('classnames');

const siteConfig = require(process.cwd() + '/siteConfig.js');
const translation = require('../../server/translation.js');
const utils = require('../utils.js');

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
                  {this.getLocalizedCategoryString(this.props.current.category)}
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
        `,
          }}
        />
      </nav>
    );
  }
  renderCategory(category) {
    return (
      <div className="navGroup navGroupActive" key={category.name}>
        <h3>{this.getLocalizedCategoryString(category.name)}</h3>
        <ul>{category.links.map(this.renderItemLink, this)}</ul>
      </div>
    );
  }
  // return appropriately translated category string
  getLocalizedCategoryString(category) {
    let categoryString = translation[this.props.language]
      ? translation[this.props.language]['localized-strings'][category] ||
        category
      : category;
    return categoryString;
  }
  // return appropriately translated label to use for doc/blog in sidebar
  getLocalizedString(metadata) {
    let localizedString;
    const i18n = translation[this.props.language];
    const sbTitle = metadata.sidebar_label;

    if (sbTitle) {
      localizedString = i18n
        ? i18n['localized-strings'][sbTitle] || sbTitle
        : sbTitle;
    } else {
      const id = metadata.original_id || metadata.localized_id;
      localizedString = i18n
        ? i18n['localized-strings'][id] || metadata.title
        : metadata.title;
    }
    return localizedString;
  }

  // return link to doc in sidebar
  getLink(metadata) {
    if (metadata.permalink) {
      const targetLink = utils.getPath(metadata.permalink, siteConfig.cleanUrl);
      if (targetLink.match(/^https?:/)) {
        return targetLink;
      }
      return siteConfig.baseUrl + targetLink;
    }
    if (metadata.path) {
      return (
        siteConfig.baseUrl +
        'blog/' +
        utils.getPath(metadata.path, siteConfig.cleanUrl)
      );
    }
    return null;
  }
  renderItemLink(link) {
    const itemClasses = classNames('navListItem', {
      navListItemActive: link.id === this.props.current.id,
    });
    const linkClasses = classNames('navItem', {
      navItemActive: link.id === this.props.current.id,
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
  contents: [],
};
module.exports = SideNav;
