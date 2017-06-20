const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;

const siteConfig = require(process.cwd() + '/siteConfig.js');

class Users extends React.Component {
  render() {
    const showcase = siteConfig.users.map(user => {
      return (
        <a href={user.infoLink}>
          <img src={user.image} title={user.caption} />
        </a>
      );
    });

    return (
      <div>
        <div className="mainContainer">
          <Container padding={['bottom', 'top']}>
            <div className="showcaseSection">
              <div className="prose">
                <h1>{siteConfig[this.props.language].using.header.title}</h1>
                <p>{siteConfig[this.props.language].using.header.content}</p>
              </div>
              <div className="logos">
                {showcase}
              </div>
              <p>{siteConfig[this.props.language].using.prompt}</p>
              <a
                href="https://github.com/deltice/test-site/edit/master/website/siteConfig.js"
                className="button"
              >
                {siteConfig[this.props.language].using.prompt_cta}
              </a>
            </div>
          </Container>
        </div>
      </div>
    );

  }
}

Users.defaultProps = {
  language: 'en',
};

module.exports = Users;