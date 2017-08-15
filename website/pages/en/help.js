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
          "Learn more using the [documentation on this site](/docusaurus/docs/en/getting-started.html).",
        title: "Browse Docs"
      },
      {
        content:
          "Submit issues and pull requests for any new features you may want to see or bugs you've found on [GitHub](https://github.com/facebookexperimental/docusaurus).",
        title: "Join the community"
      },
      {
        content:
          "Find out what's new with this project by checking back on the site.",
        title: "Stay up to date"
      }
    ];

    return (
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
    );
  }
}

module.exports = Help;
