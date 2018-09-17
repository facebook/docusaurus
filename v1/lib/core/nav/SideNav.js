/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const classNames = require('classnames');

const siteConfig = require(`${process.cwd()}/siteConfig.js`);
const translation = require('../../server/translation.js');
const {getPath, idx} = require('../utils.js');

class SideNav extends React.Component {
  // return appropriately translated category string
  getLocalizedCategoryString(category) {
    const categoryString =
      idx(translation, [
        this.props.language,
        'localized-strings',
        'categories',
        category,
      ]) || category;
    return categoryString;
  }

  // return appropriately translated label to use for doc/blog in sidebar
  getLocalizedString(metadata) {
    let localizedString;
    const i18n = translation[this.props.language];
    const id = metadata.localized_id;
    const sbTitle = metadata.sidebar_label;

    if (sbTitle) {
      localizedString =
        idx(i18n, ['localized-strings', 'docs', id, 'sidebar_label']) ||
        sbTitle;
    } else {
      localizedString =
        idx(i18n, ['localized-strings', 'docs', id, 'title']) || metadata.title;
    }
    return localizedString;
  }

  // return link to doc in sidebar
  getLink(metadata) {
    if (metadata.permalink) {
      const targetLink = getPath(metadata.permalink, siteConfig.cleanUrl);
      if (targetLink.match(/^https?:/)) {
        return targetLink;
      }
      return siteConfig.baseUrl + targetLink;
    }
    if (metadata.path) {
      return `${siteConfig.baseUrl}blog/${getPath(
        metadata.path,
        siteConfig.cleanUrl,
      )}`;
    }
    return null;
  }

  renderCategory(category) {
    return (
      <div className="navGroup" key={category.name}>
        <h3 className="navGroupCategoryTitle">
          {this.getLocalizedCategoryString(category.name)}
        </h3>
        <ul>{category.links.map(this.renderItemLink, this)}</ul>
      </div>
    );
  }

  renderItemLink(link) {
    const itemClasses = classNames('navListItem', {
      navListItemActive: link.id === this.props.current.id,
    });
    return (
      <li className={itemClasses} key={link.id}>
        <a className="navItem" href={this.getLink(link)}>
          {this.getLocalizedString(link)}
        </a>
      </li>
    );
  }

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
              {siteConfig.onPageNav === 'separate' && (
                <div className="tocToggler" id="tocToggler">
                  <i className="icon-toc" />
                </div>
              )}
            </div>
            <div className="navGroups">
              {this.props.contents.map(this.renderCategory, this)}
            </div>
          </section>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            document.addEventListener('DOMContentLoaded', function() {
              createToggler('#navToggler', '#docsNav', 'docsSliderActive');
              createToggler('#tocToggler', 'body', 'tocActive');

              const headings = document.querySelector('.toc-headings');
              headings && headings.addEventListener('click', function(event) {
                if (event.target.tagName === 'A') {
                  document.body.classList.remove('tocActive');
                }
              }, false);

              function createToggler(togglerSelector, targetSelector, className) {
                var toggler = document.querySelector(togglerSelector);
                var target = document.querySelector(targetSelector);

                if (!toggler) {
                  return;
                }

                toggler.onclick = function(event) {
                  event.preventDefault();

                  target.classList.toggle(className);
                };
              }
            });
        `,
          }}
        />
      </nav>
    );
  }
}

SideNav.defaultProps = {
  contents: [],
};

module.exports = SideNav;
