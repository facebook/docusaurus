const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Marked = CompLibrary.Marked; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a
          className="button"
          href={this.props.href}
          target={this.props.target}
        >
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

class HomeSplash extends React.Component {
  render() {
    return (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">
            <div className="projectLogo">
              <img src="/test-site/img/docusaurus.svg" />
            </div>
            <div className="inner">
              <h2 className="projectTitle">
                {siteConfig.title}
                <small>{siteConfig[this.props.language].tagline}</small>
              </h2>
              <div className="section promoSection">
                <div className="promoRow">
                  <div className="pluginRowBlock">
                    <Button href="#try">
                      {siteConfig[this.props.language].promo.try}
                    </Button>
                    <Button
                      href={
                        '/test-site/docs/' +
                          this.props.language +
                          '/doc1.html'
                      }
                    >
                      {siteConfig[this.props.language].promo.doc1}
                    </Button>
                    <Button
                      href={
                        '/test-site/docs/' +
                          this.props.language +
                          '/doc2.html'
                      }
                    >
                      {siteConfig[this.props.language].promo.doc2}
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
    let language = this.props.language;
    if(typeof language == 'undefined') {
      language = 'en';
    }
    const showcase = siteConfig.users
      .filter(user => {
        return user.pinned;
      })
      .map(user => {
        return(
          <a href={user.infoLink}>
            <img src={user.image} title={user.caption} />
          </a>
        );
      });

    return (
      <div>
        <HomeSplash
          language={language}
        />
        <div className="mainContainer">
          <Container padding={['bottom', 'top']}>
            <GridBlock
              align="center"
              contents={siteConfig[language].features}
              layout="fourColumn"
            />
          </Container>

          <div
            className="productShowcaseSection paddingBottom"
            style={{textAlign: 'center'}}>
            <h2>{siteConfig[language].featureCallout.title}</h2>
            <Marked>
              {siteConfig[language].featureCallout.content}
            </Marked>
          </div>

          <Container padding={['bottom', 'top']} background="light">
            <GridBlock
              contents={[
                {
                  content: siteConfig[language].belowFold.learn.content,
                  image: '/test-site/img/docusaurus.svg',
                  imageAlign: 'right',
                  title: siteConfig[language].belowFold.learn.title,
                },
              ]}
            />
          </Container>

          <Container padding={['bottom', 'top']} id="try">
            <GridBlock
              contents={[
                {
                  content: siteConfig[language].belowFold.try.content,
                  image: '/test-site/img/docusaurus.svg',
                  imageAlign: 'left',
                  title: siteConfig[language].belowFold.try.title,
                },
              ]}
            />
          </Container>

          <Container padding={['bottom', 'top']} background="dark">
            <GridBlock
              contents={[
                {
                  content: siteConfig[language].belowFold.description.content,
                  image: '/test-site/img/docusaurus.svg',
                  imageAlign: 'right',
                  title: siteConfig[language].belowFold.description.title,
                },
              ]}
            />
          </Container>

          
          <div className="productShowcaseSection paddingBottom">
            <h2>{siteConfig[language].belowFold.using.title}</h2>
            <p>{siteConfig[language].belowFold.using.content}</p>
            <div className="logos">
              {showcase}
            </div>
            <div className="more-users">
              <a className="button" href={siteConfig.baseUrl + "users.html"} target="_self">
                {siteConfig[language].belowFold.using.button}
              </a>
            </div>
          </div> 
        </div>
      </div>
    );
  }
}

module.exports = Index;
