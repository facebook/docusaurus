const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");
const Container = CompLibrary.Container;

const siteConfig = require(process.cwd() + "/siteConfig.js");

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
      <div className="mainContainer">
        <Container padding={["bottom", "top"]}>
          <div className="showcaseSection">
            <div className="prose">
              <h1>Who's Using This?</h1>
              <p>This project is used by many folks</p>
            </div>
            <div className="logos">
              {showcase}
            </div>
            <p>Are you using this project?</p>
            <a
              href="https://github.com/deltice/test-site/edit/master/website/siteConfig.js"
              className="button"
            >
              Add your company
            </a>
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Users;
