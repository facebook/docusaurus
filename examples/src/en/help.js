const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

class Help extends React.Component {
  render() {
    const supportLinks = [
      siteConfig[this.props.language].support.browse,
      siteConfig[this.props.language].support.join,
    ];

    return (
      <div>
        <div className="docMainWrapper wrapper">
          <Container className="mainContainer documentContainer postContainer">
            <div className="post">
              <header className="postHeader">
                <h2>{siteConfig[this.props.language].support.header.title}</h2>
              </header>
              <p>
                {siteConfig[this.props.language].support.header.content}
              </p>
              <GridBlock contents={supportLinks} layout="threeColumn" />
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

Help.defaultProps = {
  language: 'en',
};

module.exports = Help;
