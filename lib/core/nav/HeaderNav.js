/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();

const React = require("react");
const fs = require("fs");
const siteConfig = require(CWD + "/siteConfig.js");
const translation = require("../../server/translation.js");

const translate = require("../../server/translate.js").translate;
const setLanguage = require("../../server/translate.js").setLanguage;

const ENABLE_TRANSLATION = fs.existsSync(CWD + "/languages.js");
const ENABLE_VERSIONING = fs.existsSync(CWD + "/versions.json");
let versions;
if (ENABLE_VERSIONING) {
  versions = require(CWD + "/versions.json");
}
require("../../server/readMetadata.js").generateMetadataDocs();
const Metadata = require("../metadata.js");

// language dropdown nav item for when translations are enabled
class LanguageDropDown extends React.Component {
  render() {
    const enabledLanguages = [];
    let currentLanguage = "English";
    setLanguage(this.props.language);
    let helpTranslateString = translate(
      "Help Translate|recruit community translators for your project"
    );
    // add all enabled languages to dropdown
    translation["languages"].map(lang => {
      if (lang.tag == this.props.language) {
        currentLanguage = lang.name;
      }
      if (lang.tag == this.props.language) {
        return;
      }
      enabledLanguages.push(
        <li key={lang.tag}>
          <a href={siteConfig.baseUrl + lang.tag}>{lang.name}</a>
        </li>
      );
    });
    // if no languages are enabled besides English, return null
    if (enabledLanguages.length < 1) {
      return null;
    }
    // add Crowdin project recruiting link
    if (siteConfig.translationRecruitingLink) {
      enabledLanguages.push(
        <li key="recruiting">
          <a href={siteConfig.translationRecruitingLink} target="_blank">
            {helpTranslateString}
          </a>
        </li>
      );
    }

    return (
      <span>
        <li key="languages">
          <a id="languages-menu" href="#">
            <img
              className="languages-icon"
              src={this.props.baseUrl + "img/language.svg"}
            />
            {currentLanguage}
          </a>
          <div id="languages-dropdown" className="hide">
            <ul id="languages-dropdown-items">{enabledLanguages}</ul>
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

// header navbar used by all pages generated with docusaurus
class HeaderNav extends React.Component {
  constructor() {
    super();
    this.state = {
      slideoutActive: false
    };
  }
  // function to generate each header link, used with each object in siteConfig.headerLinks
  makeLinks(link) {
    let href;
    if (link.search && this.props.config.algolia) {
      // return algolia search bar
      return (
        <li className="navSearchWrapper reactNavSearchWrapper" key="search">
          <input id="search_input_react" type="text" placeholder="Search" />
        </li>
      );
    } else if (link.languages) {
      return (
        // return language dropdown
        <LanguageDropDown
          baseUrl={this.props.baseUrl}
          language={this.props.language}
          key="languagedropdown"
        />
      );
    } else if (link.doc) {
      // set link to document with current page's language/version
      let id;
      if (!ENABLE_VERSIONING || this.props.version === "next") {
        id = this.props.language + "-" + link.doc;
      } else {
        id =
          this.props.language +
          "-version-" +
          (this.props.version || versions[0]) +
          "-" +
          link.doc;
      }
      if (!Metadata[id]) {
        if (id != link.doc) {
          throw new Error(
            "It looks like you've enabled language support, but haven't provided translated files. The document with id: '" +
              id +
              "' doesn't exist."
          );
        }
        throw new Error(
          "A headerLink is specified with a document that does not exist. No document exists with id: " +
            link.doc
        );
      }
      href = this.props.config.baseUrl + Metadata[id].permalink;
    } else if (link.page) {
      // set link to page with current page's language if appropriate
      if (fs.existsSync(CWD + "/pages/en/" + link.page + ".js")) {
        href =
          siteConfig.baseUrl + this.props.language + "/" + link.page + ".html";
      } else {
        href = siteConfig.baseUrl + link.page + ".html";
      }
    } else if (link.href) {
      // set link to specified href
      href = link.href;
    } else if (link.blog) {
      // set link to blog url
      href = this.props.baseUrl + "blog";
    }
    return (
      <li key={link.label + "page"}>
        <a href={href} target={link.external ? "_blank" : "_self"}>
          {translation[this.props.language]
            ? translation[this.props.language]["localized-strings"][link.label]
            : link.label}
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
              <img
                className="logo"
                src={this.props.baseUrl + siteConfig.headerIcon}
              />
              {!this.props.config.disableHeaderTitle && (
                <h2 className="headerTitle">{this.props.title}</h2>
              )}
            </a>
            {ENABLE_VERSIONING && (
              <a href={versionsLink}>
                <h3>{this.props.version || versions[0]}</h3>
              </a>
            )}
            {this.renderResponsiveNav()}
          </header>
        </div>
      </div>
    );
  }

  renderResponsiveNav() {
    const headerLinks = this.props.config.headerLinks;
    // add language drop down to end if location not specified
    let languages = false;
    headerLinks.forEach(link => {
      if (link.languages) {
        languages = true;
      }
    });
    if (!languages) {
      headerLinks.push({ languages: true });
    }
    let search = false;
    headerLinks.forEach(link => {
      if (link.doc && !fs.existsSync(CWD + "/../docs/")) {
        throw new Error(
          "You have 'doc' in your headerLinks, but no 'docs' folder exists one level up from " +
            "'website' folder. Did you run `docusaurus-init` or `npm run examples`? If so, " +
            "make sure you rename 'docs-examples-from-docusaurus' to 'docs'."
        );
      }
      if (link.blog && !fs.existsSync(CWD + "/blog/")) {
        throw new Error(
          "You have 'blog' in your headerLinks, but no 'blog' folder exists in your " +
            "website folder. Did you run `docusaurus-init` or `npm run examples`? If so, " +
            "make sure you rename 'blog-examples-from-docusaurus' to 'blog'."
        );
      }
      if (link.page && !fs.existsSync(CWD + "/pages/")) {
        throw new Error(
          "You have 'page' in your headerLinks, but no 'pages' folder exists in your " +
            "'website' folder."
        );
      }
      // We will add search bar to end if location not specified
      if (link.search) {
        search = true;
      }
    });
    if (!search && this.props.config.algolia) {
      headerLinks.push({ search: true });
    }
    return (
      <div className="navigationWrapper navigationSlider">
        <nav className="slidingNav">
          <ul className="nav-site nav-site-internal">
            {headerLinks.map(this.makeLinks, this)}
          </ul>
        </nav>
      </div>
    );
  }
}

module.exports = HeaderNav;
