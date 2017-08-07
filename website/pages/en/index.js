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
  static defaultProps = {
    target: "_self"
  };

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

class HomeSplash extends React.Component {
  render() {
    return (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">
            <div className="projectLogo">
              <img src={`${siteConfig.baseUrl}img/docusaurus.svg`} />
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
                        ${siteConfig.baseUrl}docs/getting-started.html
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
                    "Write all of your documentation and blog posts in Markdown and have it built into a website you can publish",
                  image: `${siteConfig.baseUrl}img/markdown.png`,
                  imageAlign: "top",
                  title: "Markdown Documentation"
                },
                {
                  content:
                    "Write the content of your main pages as React components that automatically share a header and footer",
                  image: `${siteConfig.baseUrl}img/react.svg`,
                  imageAlign: "top",
                  title: "React Main Pages"
                },
                {
                  content:
                    "Translate your docs and your website using Crowdin integration",
                  image: `${siteConfig.baseUrl}img/translation.svg`,
                  imageAlign: "top",
                  title: "Translations"
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
                    "Support users of all versions by easily providing documentation for each version of your program",
                  image: `${siteConfig.baseUrl}img/docusaurus.svg`,
                  imageAlign: "top",
                  title: "Versioning"
                },
                {
                  content:
                    "Provide search for your documentation using Algolia DocSearch integration",
                  image: `${siteConfig.baseUrl}img/docusaurus.svg`,
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
                    "The provided site template lets you get a website for your project up and running quickly without having having to worry about all the site design. Provided example files help you configure your site.",
                  imageAlign: "right",
                  image: `${siteConfig.baseUrl}img/docusaurus.svg`,
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
                    "Use a local server to see how file changes affect your website without having to reload the server. Publish your site to GitHub pages manually using a script or with continuous integration like CircleCI.",
                  imageAlign: "left",
                  image: `${siteConfig.baseUrl}img/docusaurus.svg`,
                  title: "Development and Deployment"
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
                  image: `${siteConfig.baseUrl}img/docusaurus.svg`,
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
