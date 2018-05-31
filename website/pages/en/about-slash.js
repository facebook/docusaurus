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
const translate = require("../../server/translate.js").translate;

class AboutSlash extends React.Component {
  render() {
    return (
      <div className="pageContainer">
        <Container className="mainContainer documentContainer postContainer">
          <h1><translate>About Slash</translate></h1>
          <img src={`${siteConfig.baseUrl}img/docusaurus.svg`} alt="Docusaurus"/>
          <p>
            Slash is the official mascot of Docusaurus. You will find different variations of her throughout the <a href="https://docusaurus.io">website</a>, whether she is moving fast on her scooter or writing documentation at her standing desk. At Facebook, we have actual Slash plushies -- and you never know, you may see these plushies at various events and conferences in the future.
          </p>
        </Container>
        <Container className="mainContainer">
          <h2><translate>Birth of Slash</translate></h2>
          <img src={`${siteConfig.baseUrl}img/slash-birth.png`} alt="Birth of Slash"/>
          <p>
            The team sat in a conference room trying to come up with a name for the project. Dinosaurs became a theme, finally landing on Docusaurus, combining documentation with those many dinosaurs that end in "saurus". Of course, we needed a logo for our new project. Eric sat down and designed a logo that was quite beyond the norm of our normal open source project logos, but yet was just so awesome, we had to use it. We needed a name for this cute Docusaur. "Marky" for markdown? "Docky" for documentation? No, "Slash" for the normal way someone starts code documentation in many programming languages <code>//</code> or <code>/*</code> or <code>///</code>. And Slash was born.
          </p>
        </Container>
        <br/>
      </div>
    );
  }
}

AboutSlash.defaultProps = {
  language: "en"
};

AboutSlash.title = 'About Slash';

module.exports = AboutSlash;
