/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;
const translate = require('../../server/translate.js').translate;

class Help extends React.Component {
  render() {
    const {config: siteConfig} = this.props;
    const supportLinks = [
      {
        title: <translate>Browse the docs</translate>,
        content: `Learn more about Docusaurus using the [official documentation](${
          siteConfig.baseUrl
        }${siteConfig.docsUrl ? `${siteConfig.docsUrl}/` : ''}${
          this.props.language
        }/installation).`,
      },
      {
        title: <translate>Discord</translate>,
        content:
          'You can join the conversation on [Discord](https://discord.gg/docusaurus) on one of our two text channels: #docusaurus-users for user help and #docusaurus-dev for contributing help.',
      },
      {
        title: <translate>Twitter</translate>,
        content:
          'You can follow and contact us on [Twitter](https://twitter.com/docusaurus).',
      },
      {
        title: <translate>GitHub</translate>,
        content:
          'At our [GitHub repo](https://github.com/facebook/docusaurus) Browse and submit [issues](https://github.com/facebook/docusaurus/issues) or [pull requests](https://github.com/facebook/docusaurus/pulls) for bugs you find or any new features you may want implemented. Be sure to also check out our [contributing information](https://github.com/facebook/docusaurus/blob/master/CONTRIBUTING.md).',
      },
    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h1>
                <translate>Need help?</translate>
              </h1>
            </header>
            <p>
              <translate desc="statement made to reader">
                If you need help with Docusaurus, you can try one of the
                mechanisms below.
              </translate>
            </p>
            <GridBlock contents={supportLinks} layout="fourColumn" />
          </div>
        </Container>
      </div>
    );
  }
}

Help.title = 'Help';

module.exports = Help;
