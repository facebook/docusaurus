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
const Showcase = require(`${process.cwd()}/core/Showcase.js`);
const translate = require('../../server/translate.js').translate;

function HomeSplash(props) {
  const {siteConfig, language} = props;

  return (
    <div className="index-hero">
      <div className="index-hero-inner">
        <h1 className="index-hero-project-tagline">
          <img
            alt="Docusaurus with Keytar"
            className="index-hero-logo"
            src={`${siteConfig.baseUrl}img/docusaurus_keytar.svg`}
          />
          {siteConfig.title} makes it easy to maintain{' '}
          <span className="index-hero-project-keywords">Open Source</span>{' '}
          documentation websites.
        </h1>
        <div className="index-ctas">
          <a
            className="button index-ctas-get-started-button"
            href={`${siteConfig.baseUrl}docs/${language}/installation`}>
            <translate>Get Started</translate>
          </a>
          <span className="index-ctas-github-button">
            <iframe
              src="https://ghbtns.com/github-btn.html?user=facebook&amp;repo=docusaurus&amp;type=star&amp;count=true&amp;size=large"
              frameBorder={0}
              scrolling={0}
              width={160}
              height={30}
              title="GitHub Stars"
            />
          </span>
        </div>
      </div>
    </div>
  );
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = 'en'} = this.props;
    const pinnedUsersToShowcase = siteConfig.users.filter(user => user.pinned);

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="announcement">
          <div className="announcement-inner">
            We're working on{' '}
            <a href="https://github.com/facebook/Docusaurus/issues/789">
              Docusaurus 2
            </a>
            , contribute to its roadmap by suggesting features or giving
            feedback <a href="https://v2.docusaurus.io/feedback/">here</a>!
          </div>
        </div>
        <div className="mainContainer">
          <Container padding={['bottom', 'top']} background="light">
            <GridBlock
              align="center"
              contents={[
                {
                  content: `Save time and focus on your project's documentation. Simply
                    write docs and blog posts with [Markdown](${
                      siteConfig.baseUrl
                    }docs/${this.props.language}/doc-markdown)
                    and Docusaurus will publish a set of static html files ready
                    to serve.`,
                  image: `${siteConfig.baseUrl}img/undraw_typewriter.svg`,
                  imageAlign: 'top',
                  imageAlt: 'Markdown',
                  title: <translate>Powered by Markdown</translate>,
                },
                {
                  content: `[Extend or customize](${siteConfig.baseUrl}docs/${
                    this.props.language
                  }/api-pages)
                    your project's layout by reusing React. Docusaurus can be
                    extended while reusing the same header and footer.`,
                  image: `${siteConfig.baseUrl}img/undraw_react.svg`,
                  imageAlign: 'top',
                  imageAlt: 'React',
                  title: <translate>Built Using React</translate>,
                },
                {
                  content: `[Localization](${siteConfig.baseUrl}docs/${
                    this.props.language
                  }/translation)
                    comes pre-configured. Use [Crowdin](https://crowdin.com/) to translate your docs
                    into over 70 languages.`,
                  image: `${siteConfig.baseUrl}img/undraw_around_the_world.svg`,
                  imageAlign: 'top',
                  imageAlt: 'Translation',
                  title: <translate>Ready for Translations</translate>,
                },
              ]}
              layout="threeColumn"
            />
            <br />
            <br />
            <GridBlock
              align="center"
              contents={[
                {
                  content: `Support users on all versions of your project. Document
                    [versioning](${siteConfig.baseUrl}docs/${
                    this.props.language
                  }/versioning)
                    helps you keep documentation in sync with project releases.`,
                  image: `${siteConfig.baseUrl}img/undraw_version_control.svg`,
                  imageAlign: 'top',
                  imageAlt: 'Document Versioning',
                  title: <translate>Document Versioning</translate>,
                },
                {
                  content: `Make it easy for your community to [find](${
                    siteConfig.baseUrl
                  }docs/${
                    this.props.language
                  }/search) what they need in your documentation.
                    We proudly support [Algolia documentation search](https://www.algolia.com/).`,
                  image: `${siteConfig.baseUrl}img/undraw_algolia.svg`,
                  imageAlign: 'top',
                  imageAlt: 'Document Search',
                  title: <translate>Document Search</translate>,
                },
              ]}
              layout="twoColumn"
            />
          </Container>
          <Container padding={['bottom', 'top']}>
            <GridBlock
              contents={[
                {
                  content: `Get [up and running](${siteConfig.baseUrl}docs/${
                    this.props.language
                  }/site-creation)
                    quickly without having to worry about site design.`,
                  imageAlign: 'right',
                  image: `${siteConfig.baseUrl}img/undraw_setup_wizard.svg`,
                  imageAlt: 'Docusaurus on a Scooter',
                  title: <translate>Quick Setup</translate>,
                },
              ]}
              layout="twoColumn"
            />
          </Container>
          <Container padding={['bottom', 'top']} background="light">
            <GridBlock
              contents={[
                {
                  content: `Make design and documentation changes by using the included
                    [live server](${siteConfig.baseUrl}docs/${
                    this.props.language
                  }/site-preparation#verifying-installation).
                    [Publish](${siteConfig.baseUrl}docs/${
                    this.props.language
                  }/publishing)
                    your site to GitHub pages or other static file hosts
                    manually, using a script, or with continuous integration
                    like CircleCI.`,
                  imageAlign: 'left',
                  image: `${siteConfig.baseUrl}img/docusaurus_live.gif`,
                  imageAlt: 'Docusaurus Demo',
                  title: <translate>Develop and Deploy</translate>,
                },
              ]}
              layout="twoColumn"
            />
          </Container>
          <Container padding={['bottom', 'top']}>
            <GridBlock
              contents={[
                {
                  content: `Docusaurus currently provides support to help your website
                    use [translations](${siteConfig.baseUrl}docs/${
                    this.props.language
                  }/translation),
                    [search](${siteConfig.baseUrl}docs/${
                    this.props.language
                  }/search),
                    and [versioning](${siteConfig.baseUrl}docs/${
                    this.props.language
                  }/versioning),
                    along with some other special [documentation markdown features](${
                      siteConfig.baseUrl
                    }docs/${this.props.language}/doc-markdown).
                    If you have ideas for useful features, feel free to
                    contribute on [GitHub](https://github.com/facebook/docusaurus)!`,
                  imageAlign: 'right',
                  image: `${
                    siteConfig.baseUrl
                  }img/undraw_features_overview.svg`,
                  imageAlt: 'Monochromatic Docusaurus',
                  title: <translate>Website Features</translate>,
                },
              ]}
              layout="twoColumn"
            />
          </Container>
          <div className="productShowcaseSection paddingBottom">
            <h2>
              <translate>Who is Using Docusaurus?</translate>
            </h2>
            <p>
              <translate>
                Docusaurus is building websites for these projects...
              </translate>
            </p>
            <Showcase users={pinnedUsersToShowcase} />
            <div className="more-users">
              <a
                className="button"
                href={`${siteConfig.baseUrl}${this.props.language}/users`}>
                <translate>All Docusaurus Users</translate>
              </a>
            </div>
          </div>
          <div className="testimonials">
            <Container padding={['bottom', 'top']}>
              <GridBlock
                align="center"
                contents={[
                  {
                    content:
                      "*I've helped open source many projects at Facebook and every one needed a website. They all had very similar constraints: the documentation should be written in markdown and be deployed via GitHub pages. None of the existing solutions were great, so I hacked my own and then forked it whenever we needed a new website. I’m so glad that Docusaurus now exists so that I don’t have to spend a week each time spinning up a new one.*",
                    image: `${siteConfig.baseUrl}img/christopher-chedeau.jpg`,
                    imageAlign: 'top',
                    imageAlt: 'Christopher "vjeux" Chedeau',
                    title:
                      'Christopher "vjeux" Chedeau <br/><font size="2">Lead Prettier Developer</font>',
                  },
                  {
                    content:
                      '*Open source contributions to the React Native docs have skyrocketed after our move to Docusaurus. The docs are now hosted on a small repo in plain markdown, with none of the clutter that a typical static site generator would require. Thanks Slash!*',
                    image: `${siteConfig.baseUrl}img/hector-ramos.png`,
                    imageAlign: 'top',
                    imageAlt: 'Hector Ramos',
                    title:
                      'Hector Ramos <br/><font size="2">Lead React Native Advocate</font>',
                  },
                  {
                    content:
                      '*Docusaurus has been a great choice for the ReasonML family of projects. It makes our documentation consistent, i18n-friendly, easy to maintain, and friendly for new contributors.*',
                    image: `${siteConfig.baseUrl}img/ricky-vetter.jpg`,
                    imageAlign: 'top',
                    imageAlt: 'Ricky Vetter',
                    title:
                      'Ricky Vetter <br/><font size="2">ReasonReact Developer</font>',
                  },
                ]}
                layout="threeColumn"
              />
            </Container>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Index;
