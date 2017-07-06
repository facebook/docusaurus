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
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + "/siteConfig.js");

class Help extends React.Component {
  render() {
    const supportLinks = [
      {
        content:
          "Learn more using the [documentation on this site.](/test-site/docs/en/doc1.html)\n",
        title: "Browse Docs"
      },
      {
        content: "Ask questions about the documentation and project\n",
        title: "Join the community"
      },
      {
        content: "Find out what's new with this project\n",
        title: "Stay up to date"
      }
    ];

    return (
      <div>
        <div className="docMainWrapper wrapper">
          <Container className="mainContainer documentContainer postContainer">
            <div className="post">
              <header className="postHeader">
                <h2>Need help?</h2>
              </header>
              <p>This project is maintained by a dedicated group of people.</p>
              <GridBlock contents={supportLinks} layout="threeColumn" />
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

Help.defaultProps = {
  language: "en"
};

module.exports = Help;
