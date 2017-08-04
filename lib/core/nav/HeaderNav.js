/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const CWD = process.cwd();

const React = require("react");
const fs = require("fs");
const siteConfig = require(CWD + "/siteConfig.js");
const translation = require("../../server/translation.js");

const ENABLE_TRANSLATION = fs.existsSync(CWD + "/languages.js");
const ENABLE_VERSIONING = fs.existsSync(CWD + "/versions.json");
let versions;
if (ENABLE_VERSIONING) {
  versions = require(CWD + "/versions.json");
}

class LanguageDropDown extends React.Component {
  render() {
    const enabledLanguages = [];
    let currentLanguage = "English";

    translation["languages"].map(lang => {
      if (lang.tag == this.props.language) {
        currentLanguage = lang.name;
      }
      if (lang.tag == this.props.language) {
        return;
      }
      enabledLanguages.push(
        <li key={lang.tag}>
          <a href={siteConfig.baseUrl + lang.tag}>
            {lang.name}
          </a>
        </li>
      );
    });

    if (enabledLanguages.length < 1) {
      return null;
    }

    if (siteConfig.recruitingLink) {
      enabledLanguages.push(
        <li key="recruiting">
          <a href={siteConfig.recruitingLink} target="_blank">
            Help Translate
          </a>
        </li>
      );
    }

    return (
      <span>
        <li>
          <a id="languages-menu" href="#">
            <img
              className="languages-icon"
              src={this.props.baseUrl + "img/language.svg"}
            />
            {currentLanguage}
          </a>
          <div id="languages-dropdown" className="hide">
            <ul id="languages-dropdown-items">
              {enabledLanguages}
            </ul>
          </div>
        </li>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        const languagesMenuItem = document.getElementById("languages-menu");
        const languagesDropDown = document.getElementById("languages-dropdown");
        languagesMenuItem.addEventListener("click", function(){
          if(languagesDropDown.className == "hide") {
            languagesDropDown.className = "visible";
          } else {
            languagesDropDown.className = "hide";
          }
        });
      `
          }}
        />
      </span>
    );
  }
}

class HeaderNav extends React.Component {
  constructor() {
    super();
    this.state = {
      slideoutActive: false
    };
  }

  makeInternalLinks(link) {
    let updatedLink = link.href.replace(
      /\/LANGUAGE\//,
      "/" + this.props.language + "/"
    );
    if (this.props.version) {
      updatedLink = updatedLink.replace(
        /\/VERSION\//,
        "/" + this.props.version + "/"
      );
    } else {
      updatedLink = updatedLink.replace(/\/VERSION\//, "/");
    }
    return (
      <li key={link.section}>
        <a
          href={updatedLink}
          className={link.section === this.props.section ? "active" : ""}
        >
          {translation[this.props.language]
            ? translation[this.props.language]["localized-strings"][link.text]
            : link.text}
        </a>
      </li>
    );
  }

  makeExternalLinks(link) {
    return (
      <li key={link.section}>
        <a
          href={link.href}
          className={link.section === this.props.section ? "active" : ""}
          target={siteConfig.externalLinkTarget || "_self"}
        >
          {translation[this.props.language]
            ? translation[this.props.language]["localized-strings"][link.text]
            : link.text}
        </a>
      </li>
    );
  }

  render() {
    const versionsLink =
      this.props.baseUrl +
      (ENABLE_TRANSLATION
        ? this.props.language + "/versions.html"
        : "versions.html");
    return (
      <div className="fixedHeaderContainer">
        <div className="headerWrapper wrapper">
          <header>
            <a href={this.props.baseUrl}>
              <img src={this.props.baseUrl + siteConfig.headerIcon} />
              {!this.props.config.disableHeaderTitle &&
                <h2>
                  {this.props.title}
                </h2>}
            </a>
            {ENABLE_VERSIONING &&
              <a href={versionsLink}>
                <h3>
                  {this.props.version || versions[0]}
                </h3>
              </a>}
            {this.renderResponsiveNav()}
          </header>
        </div>
      </div>
    );
  }

  renderResponsiveNav() {
    return (
      <div className="navigationWrapper navigationSlider">
        <nav className="slidingNav">
          <ul className="nav-site nav-site-internal">
            {this.props.config.headerLinksInternal.map(
              this.makeInternalLinks,
              this
            )}
            <LanguageDropDown
              baseUrl={this.props.baseUrl}
              language={this.props.language}
            />
            {this.props.config.algolia &&
              <li className="navSearchWrapper reactNavSearchWrapper">
                <input
                  id="search_input_react"
                  type="text"
                  placeholder="Search"
                />
              </li>}
            {this.props.config.headerLinksExternal.map(
              this.makeExternalLinks,
              this
            )}
          </ul>
        </nav>
      </div>
    );
  }
}

module.exports = HeaderNav;
