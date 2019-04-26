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

  renderCategory = categoryItem => {
    let ulClassName = '';
    let categoryClassName = 'navGroupCategoryTitle';
    let arrow;

    if (siteConfig.docsSideNavCollapsible) {
      categoryClassName += ' collapsible';
      ulClassName = 'hide';
      arrow = (
        <span className="arrow">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#565656"
              d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
            />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </span>
      );
    }

    return (
      <div className="navGroup" key={categoryItem.title}>
        <h3 className={categoryClassName}>
          {this.getLocalizedCategoryString(categoryItem.title)}
          {arrow}
        </h3>
        <ul className={ulClassName}>
          {categoryItem.children.map(item => {
            switch (item.type) {
              case 'LINK':
                return this.renderItemLink(item);
              case 'SUBCATEGORY':
                return this.renderSubcategory(item);
              default:
                return null;
            }
          })}
        </ul>
      </div>
    );
  };

  renderSubcategory = subcategoryItem => (
    <div className="navGroup subNavGroup" key={subcategoryItem.title}>
      <h4 className="navGroupSubcategoryTitle">
        {this.getLocalizedCategoryString(subcategoryItem.title)}
      </h4>
      <ul>{subcategoryItem.children.map(this.renderItemLink)}</ul>
    </div>
  );

  renderItemLink = linkItem => {
    const linkMetadata = linkItem.item;
    const itemClasses = classNames('navListItem', {
      navListItemActive: linkMetadata.id === this.props.current.id,
    });
    return (
      <li className={itemClasses} key={linkMetadata.id}>
        <a className="navItem" href={this.getLink(linkMetadata)}>
          {this.getLocalizedString(linkMetadata)}
        </a>
      </li>
    );
  };

  render() {
    return (
      <nav className="toc">
        <div className="toggleNav">
          <section className="navWrapper wrapper">
            <div className="navBreadcrumb wrapper">
              <div className="navToggle" id="navToggler">
                <div className="hamburger-menu">
                  <div className="line1" />
                  <div className="line2" />
                  <div className="line3" />
                </div>
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
              {this.props.contents.map(this.renderCategory)}
            </div>
          </section>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            var coll = document.getElementsByClassName('collapsible');
            var checkActiveCategory = true;
            for (var i = 0; i < coll.length; i++) {
              var links = coll[i].nextElementSibling.getElementsByTagName('*');
              if (checkActiveCategory){
                for (var j = 0; j < links.length; j++) {
                  if (links[j].classList.contains('navListItemActive')){
                    coll[i].nextElementSibling.classList.toggle('hide');
                    coll[i].childNodes[1].classList.toggle('rotate');
                    checkActiveCategory = false;
                    break;
                  }
                }
              }

              coll[i].addEventListener('click', function() {
                var arrow = this.childNodes[1];
                arrow.classList.toggle('rotate');
                var content = this.nextElementSibling;
                content.classList.toggle('hide');
              });
            }

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
