/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");
const Marked = CompLibrary.Marked; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + "/siteConfig.js");

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: "_self"
};

class HomeSplash extends React.Component {
  render() {
    return (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">
            <div className="projectLogo">
              <img src={`${siteConfig.baseUrl}img/docusaurus_keytar.svg`} />
            </div>
            <div className="inner">
              <h2 className="projectTitle">
                {siteConfig.title}
                <small>
                  {siteConfig.tagline}
                </small>
              </h2>
              <div className="section promoSection">
                <div className="promoRow">
                  <div className="pluginRowBlock">
                    <Button
                      href={`
                        ${siteConfig.baseUrl}docs/installation.html
                        `}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Index extends React.Component {
  render() {
    let language = this.props.language || "en";
    const showcase = siteConfig.users
      .filter(user => {
        return user.pinned;
      })
      .map(user => {
        return (
          <a href={user.infoLink}>
            <img src={user.image} title={user.caption} />
          </a>
        );
      });

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Container padding={["bottom", "top"]}>
            <GridBlock
              align="center"
              contents={[
                {
                  content:
                    "Save time and focus on your project's documentation. Simply write docs and blog posts with Markdown and Docusaurus will publish a set of static html files ready to serve.",
                  image: `${siteConfig.baseUrl}img/markdown.png`,
                  imageAlign: "top",
                  title: "Powered by Markdown"
                },
                {
                  content:
                    "Extend or customize your project's layout by reusing React. Docusaurus can be extended while reusing the same header and footer.",
                  image: `${siteConfig.baseUrl}img/react.svg`,
                  imageAlign: "top",
                  title: "Built Using React"
                },
                {
                  content:
                    "Localization comes pre-configured. Use Crowdin to translate your docs into over 70 languages.",
                  image: `${siteConfig.baseUrl}img/translation.svg`,
                  imageAlign: "top",
                  title: "Ready for Translations"
                }
              ]}
              layout="threeColumn"
            />
            <br />
            <br />
            <GridBlock
              align="center"
              contents={[
                {
                  content:
                    "Support users on all versions of your project. Document Versioning helps you keep documentation in sync with project releases.",
                  image: `${siteConfig.baseUrl}img/versioning.svg`,
                  imageAlign: "top",
                  title: "Document Versioning"
                },
                {
                  content:
                    "Make it easy for your community to find what they need in your documentation. Currently supports Algolia DocSearch.",
                  image: `${siteConfig.baseUrl}img/search.svg`,
                  imageAlign: "top",
                  title: "Document Search"
                }
              ]}
              layout="twoColumn"
            />
          </Container>
          <Container padding={["bottom", "top"]} background="light">
            <GridBlock
              contents={[
                {
                  content:
                    "Get up and running quickly without having having to worry about site design.",
                  imageAlign: "right",
                  image: `${siteConfig.baseUrl}img/docusaurus_speed.svg`,
                  title: "Quick Setup"
                }
              ]}
              layout="twoColumn"
            />
          </Container>
          <Container padding={["bottom", "top"]}>
            <GridBlock
              contents={[
                {
                  content:
                    "Make design and documentation changes by using the included live server. Publish your site to GitHub pages or other static file hosts manually, using a script, or with continuous integration like CircleCI.",
                  imageAlign: "left",
                  image: `${siteConfig.baseUrl}img/docusaurus_live.gif`,
                  title: "Develop and Deploy"
                }
              ]}
              layout="twoColumn"
            />
          </Container>
          <Container padding={["bottom", "top"]} background="light">
            <GridBlock
              contents={[
                {
                  content:
                    "Docusaurus currently provides support to help your website use [translations](/docs/translation.html), [search](/docs/search.html), and [versioning](/docs/versioning.html), along with some other special [documentation markdown features](/docs/doc-markdown.html). If you have ideas for useful features, feel free to contribute on [GitHub](https://github.com/facebookexperimental/docusaurus)!",
                  imageAlign: "right",
                  image: `${siteConfig.baseUrl}img/docusaurus_monochrome.svg`,
                  title: "Website Features"
                }
              ]}
              layout="twoColumn"
            />
          </Container>

          <div className="productShowcaseSection paddingBottom">
            <h2>
              {"Who's Using This?"}
            </h2>
            <p>Docusaurus is building websites for these projects</p>
            <div className="logos">
              {showcase}
            </div>
            <div className="more-users">
              <a
                className="button"
                href={`${siteConfig.baseUrl}${this.props.language}/users.html`}
              >
                All Docusaurus Users
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Index;
