/**
 * Copyright (c) 2017-present, Facebook, Inc.
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
    const supportLinks = [
      {
        content: (
          <translate>
            Learn more using the [documentation on this
            site.](/test-site/docs/en/doc1.html)
          </translate>
        ),
        title: <translate>Browse Docs</translate>,
      },
      {
        content: (
          <translate>
            Ask questions about the documentation and project
          </translate>
        ),
        title: <translate>Join the community</translate>,
      },
      {
        content: <translate>Find out what's new with this project</translate>,
        title: <translate>Stay up to date</translate>,
      },
    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h2>
                <translate>Need help?</translate>
              </h2>
            </header>
            <p>
              <translate desc="statement made to reader">
                This project is maintained by a dedicated group of people.
              </translate>
            </p>
            <GridBlock contents={supportLinks} layout="threeColumn" />
          </div>
        </Container>
      </div>
    );
  }
}

Help.defaultProps = {
  language: 'en',
};

module.exports = Help;
