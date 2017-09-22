const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");
const Marked = CompLibrary.Marked; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + "/siteConfig.js");

class Button extends React.Component {
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

Button.defaultProps = {
  target: "_self"
};

class HomeSplash extends React.Component {
  render() {
    return (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">
            <div className="projectLogo">
              <img src={siteConfig.baseUrl + "/img/docusaurus.svg"} />
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
                    <Button href="#try">Try It Out</Button>
                    <Button
                      href={
                        siteConfig.baseUrl +
                        "docs/" +
                        this.props.language +
                        "/doc1.html"
                      }
                    >
                      Example Link
                    </Button>
                    <Button
                      href={
                        siteConfig.baseUrl +
                        "docs/" +
                        this.props.language +
                        "/doc2.html"
                      }
                    >
                      Example Link 2
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
                  content: "This is the content of my feature",
                  image: siteConfig.baseUrl + "img/docusaurus.svg",
                  imageAlign: "top",
                  title: "Feature One"
                },
                {
                  content: "The content of my second feature",
                  image: siteConfig.baseUrl + "img/docusaurus.svg",
                  imageAlign: "top",
                  title: "Feature Two"
                }
              ]}
              layout="fourColumn"
            />
          </Container>

          <div
            className="productShowcaseSection paddingBottom"
            style={{ textAlign: "center" }}
          >
            <h2>Feature Callout</h2>
            <Marked>These are features of this project</Marked>
          </div>

          <Container padding={["bottom", "top"]} background="light">
            <GridBlock
              contents={[
                {
                  content: "Talk about learning how to use this",
                  image: siteConfig.baseUrl + "img/docusaurus.svg",
                  imageAlign: "right",
                  title: "Learn How"
                }
              ]}
            />
          </Container>

          <Container padding={["bottom", "top"]} id="try">
            <GridBlock
              contents={[
                {
                  content: "Talk about trying this out",
                  image: siteConfig.baseUrl + "img/docusaurus.svg",
                  imageAlign: "left",
                  title: "Try it Out"
                }
              ]}
            />
          </Container>

          <Container padding={["bottom", "top"]} background="dark">
            <GridBlock
              contents={[
                {
                  content:
                    "This is another description of how this project is useful",
                  image: siteConfig.baseUrl + "img/docusaurus.svg",
                  imageAlign: "right",
                  title: "Description"
                }
              ]}
            />
          </Container>

          <div className="productShowcaseSection paddingBottom">
            <h2>
              {"Who's Using This?"}
            </h2>
            <p>This project is used by all these people</p>
            <div className="logos">
              {showcase}
            </div>
            <div className="more-users">
              <a
                className="button"
                href={
                  siteConfig.baseUrl + this.props.language + "/" + "users.html"
                }
              >
                More {siteConfig.title} Users
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Index;
