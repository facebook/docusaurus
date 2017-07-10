/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require("react");

const siteConfig = require(process.cwd() + "/siteConfig.js");

class LanguageDropDown extends React.Component {
  render() {
    const enabledLanguages = [];
    let currentLanguage = "English";

    siteConfig["languages"].map(lang => {
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

    enabledLanguages.push(
      <li key="recruiting">
        <a href={siteConfig.recruitingLink} target="_blank">
          Help Translate
        </a>
      </li>
    );
    if (enabledLanguages.length <= 1) {
      return null;
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

  makeLinks(link) {
    const linkWithLang = link.href.replace(
      /\/LANGUAGE\//,
      "/" + this.props.language + "/"
    );
    return (
      <li key={link.section}>
        <a
          href={linkWithLang}
          className={link.section === this.props.section ? "active" : ""}
        >
          {siteConfig[this.props.language]
            ? siteConfig[this.props.language]["localized-strings"][link.text]
            : link.text}
        </a>
      </li>
    );
  }

  render() {
    return (
      <div className="fixedHeaderContainer">
        <div className="headerWrapper wrapper">
          <header>
            <a href={this.props.baseUrl}>
              <img src={this.props.baseUrl + siteConfig.headerIcon} />
              <h2>
                {this.props.title}
              </h2>
            </a>
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
            {this.props.config.headerLinksInternal.map(this.makeLinks, this)}
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
            {this.props.config.headerLinksExternal.map(this.makeLinks, this)}
          </ul>
        </nav>
      </div>
    );
  }
}

module.exports = HeaderNav;
