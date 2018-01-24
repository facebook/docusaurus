/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");
const CompLibrary = require("../../core/CompLibrary.js");
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;
const siteConfig = require(process.cwd() + "/siteConfig.js");

class Help extends React.Component {
  render() {
    const supportLinks = [
      {
        title: "Browse the docs",
        content:
          `Learn more about Docusaurus using the [official documentation](${siteConfig.baseUrl}docs/${this.props.language}/installation.html).`,
      },
      {
        title: "Discord",
        content:
          "You can join the conversation on [Discord](https://discord.gg/docusaurus) on one of our two text channels: #docusaurus-users for user help and #docusaurus-dev for contributing help."
      },
      {
        title: "Twitter",
        content:
          "You can follow and contact us on [Twitter](https://twitter.com/docusaurus)."
      },
      {
        title: "GitHub",
        content:
          "At our [GitHub repo](https://github.com/facebook/docusaurus) Browse and submit [issues](https://github.com/facebook/Docusaurus/issues) or [pull requests](https://github.com/facebook/Docusaurus/pulls) for bugs you find or any new features you may want implemented. Be sure to also check out our [contributing information](https://github.com/facebook/Docusaurus/blob/master/CONTRIBUTING.md)."
      }
    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h2>Need help?</h2>
            </header>
            <p>
              If you need help with Docusaurus, you can try one of the mechanisms below.
            </p>
            <GridBlock contents={supportLinks} layout="fourColumn" />
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Help;
