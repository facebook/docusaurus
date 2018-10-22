import React from 'react';
import Helmet from 'react-helmet';

import classnames from 'classnames';

import styles from './styles.css';

const FEATURES = [
  {
    title: 'Powered by Markdown',
    description: (
      <>
        Save time and focus on your projects documentation. Simply write docs
        and blog posts with Markdown and Docusaurus will publish a set of static
        html files ready to serve.
      </>
    ),
    icon: '/img/markdown.png',
  },
  {
    title: 'Built Using React',
    description: (
      <>
        Extend or customize your project's layout by reusing React. Docusaurus
        can be extended while reusing the same header and footer.
      </>
    ),
    icon: '/img/react.svg',
  },
  {
    title: 'Ready for Translations',
    description: (
      <>
        Localization comes pre-configured. Use Crowdin to translate your docs
        into over 70 languages.
      </>
    ),
    icon: '/img/translation.svg',
  },
  {
    title: 'Document Versioning',
    description: (
      <>
        Support users on all versions of your project. Document versioning helps
        you keep documentation in sync with project releases.
      </>
    ),
    icon: '/img/versioning.svg',
  },
  {
    title: 'Document Search',
    description: (
      <>
        Make it easy for your community to find what they need in your
        documentation. We proudly support Algolia documentation search.
      </>
    ),
    icon: '/img/search.svg',
  },
];

const QUOTES = [
  {
    thumbnail: '/img/christopher-chedeau.jpg',
    name: 'Christopher "vjeux" Chedeau',
    title: 'Lead Prettier Developer',
    text: (
      <>
        I've helped open source many projects at Facebook and every one needed a
        website. They all had very similar constraints: the documentation should
        be written in markdown and be deployed via GitHub pages. None of the
        existing solutions were great, so I hacked my own and then forked it
        whenever we needed a new website. I’m so glad that Docusaurus now exists
        so that I don’t have to spend a week each time spinning up a new one.
      </>
    ),
  },
  {
    thumbnail: '/img/hector-ramos.png',
    name: 'Hector Ramos',
    title: 'Lead React Native Advocate',
    text: (
      <>
        Open source contributions to the React Native docs have skyrocketed
        after our move to Docusaurus. The docs are now hosted on a small repo in
        plain markdown, with none of the clutter that a typical static site
        generator would require. Thanks Slash!
      </>
    ),
  },
  {
    thumbnail: '/img/ricky-vetter.jpg',
    name: 'Ricky Vetter',
    title: 'ReasonReact Developer',
    text: (
      <>
        Docusaurus has been a great choice for the ReasonML family of projects.
        It makes our documentation consistent, i18n-friendly, easy to maintain,
        and friendly for new contributors.
      </>
    ),
  },
];

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {featureIndex: 0};
  }

  componentDidMount() {
    window.setInterval(() => {
      this.setState(prevState => ({
        featureIndex: (prevState.featureIndex + 1) % FEATURES.length,
      }));
    }, 3000);
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Docusaurus</title>
        </Helmet>
        <div className={classnames(styles.section, styles.banner)}>
          <div className={classnames(styles.sectionInner, styles.bannerInner)}>
            <h1 className={styles.header}>Docusaurus</h1>
            <h2 className={styles.subtitle}>
              Easy to maintain Open Source
              <br />
              Documentation websites
            </h2>
            <div className={styles.headerLinksContainer}>
              <a className={styles.headerLink} href="">
                Get Started
              </a>
              <a
                className={classnames(styles.headerLink, styles.gitHubLink)}
                href="https://github.com/facebook/docusaurus"
                target="_blank">
                GitHub
              </a>
              <div />
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.row}>
              <div className={styles.column}>
                <ul className={styles.featureList}>
                  {FEATURES.map((feature, index) => (
                    <li
                      className={styles.featureListItem}
                      key={feature.title}
                      onClick={() => {
                        this.setState({
                          featureIndex: index,
                        });
                      }}>
                      <a
                        className={classnames(styles.featureListLink, {
                          [styles.featureListLinkSelected]:
                            index === this.state.featureIndex,
                        })}
                        role="button">
                        {feature.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.column}>
                {(() => {
                  const feature = FEATURES[this.state.featureIndex];
                  return (
                    <div>
                      <div className={styles.featureIconContainer}>
                        <img
                          className={styles.featureIcon}
                          src={feature.icon}
                        />
                      </div>
                      <h3 className={styles.featureTitle}>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
        <div
          className={classnames(
            styles.section,
            styles.sectionAlt,
            styles.quotes,
          )}>
          <div className={styles.sectionInner}>
            <div className={styles.row}>
              {QUOTES.map(quote => (
                <div className={styles.column}>
                  <img
                    className={styles.quoteThumbnail}
                    src={quote.thumbnail}
                  />
                  <h3 className={styles.quoteName}>{quote.name}</h3>
                  <h4 className={styles.quoteTitle}>{quote.title}</h4>
                  <p className={styles.quoteText}>{quote.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
