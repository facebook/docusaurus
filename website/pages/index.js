/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState, useContext} from 'react';
import Head from '@docusaurus/Head';
import DocusaurusContext from '@docusaurus/context';

import classnames from 'classnames';

import styles from './styles.module.css';

const FEATURE_INTERVAL = 3000;
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
        Extend or customize your project&apos;s layout by reusing React.
        Docusaurus can be extended while reusing the same header and footer.
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
      <p>
        I&apos;ve helped open source many projects at Facebook and every one
        needed a website. They all had very similar constraints: the
        documentation should be written in markdown and be deployed via GitHub
        pages. None of the existing solutions were great, so I hacked my own and
        then forked it whenever we needed a new website. I’m so glad that
        Docusaurus now exists so that I don’t have to spend a week each time
        spinning up a new one.
      </p>
    ),
  },
  {
    thumbnail: '/img/hector-ramos.png',
    name: 'Hector Ramos',
    title: 'Lead React Native Advocate',
    text: (
      <p>
        Open source contributions to the React Native docs have skyrocketed
        after our move to Docusaurus. The docs are now hosted on a small repo in
        plain markdown, with none of the clutter that a typical static site
        generator would require. Thanks Slash!
      </p>
    ),
  },
  {
    thumbnail: '/img/ricky-vetter.jpg',
    name: 'Ricky Vetter',
    title: 'ReasonReact Developer',
    text: (
      <p>
        Docusaurus has been a great choice for the ReasonML family of projects.
        It makes our documentation consistent, i18n-friendly, easy to maintain,
        and friendly for new contributors.
      </p>
    ),
  },
];

function Home() {
  const context = useContext(DocusaurusContext);
  const {siteConfig = {}} = context;
  const [featureIndex, setFeatureIndex] = useState(0);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFeatureIndex(
        prevFeatureIndex => (prevFeatureIndex + 1) % FEATURES.length,
      );
    }, FEATURE_INTERVAL);
    return () => {
      window.clearTimeout(timer);
    };
  }, [featureIndex]);

  return (
    <div>
      <Head key={featureIndex}>
        <title>Docusaurus</title>
      </Head>
      <div className={styles['index-hero']}>
        <div className={styles['index-hero-inner']}>
          <h1 className={styles['index-hero-project-tagline']}>
            <img
              alt="Docusaurus with Keytar"
              className={styles['index-hero-logo']}
              src={`${siteConfig.baseUrl}img/docusaurus_keytar.svg`}
            />
            {siteConfig.title} makes it easy to maintain{' '}
            <span className={styles['index-hero-project-keywords']}>
              Open Source
            </span>{' '}
            documentation websites.
          </h1>
          <div className={styles['index-ctas']}>
            <a
              className={styles['index-ctas-get-started-button']}
              href={`${siteConfig.baseUrl}docs/installation`}>
              Get Started
            </a>
            <span className={styles['index-ctas-github-button']}>
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
      <div className={styles['announcement']}>
        <div className={styles['announcement-inner']}>
          We're working on{' '}
          <a href="https://github.com/facebook/Docusaurus/issues/789">
            Docusaurus 2
          </a>
          , contribute to its roadmap by suggesting features or giving feedback{' '}
          <a href={`${siteConfig.baseUrl}feedback`}>here</a>!
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>Features</h2>
              <ul className={styles.featureList}>
                {FEATURES.map((feature, index) => (
                  <li
                    className={styles.featureListItem}
                    key={feature.title}
                    onClick={() => {
                      setFeatureIndex(index);
                    }}>
                    <button
                      className={classnames(styles.featureListButton, {
                        [styles.featureListButtonSelected]:
                          index === featureIndex,
                      })}
                      type="button">
                      {feature.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.column}>
              {(() => {
                const feature = FEATURES[featureIndex];
                return (
                  <div>
                    <div className={styles.featureIconContainer}>
                      <img
                        alt={feature.title}
                        className={styles.featureIcon}
                        src={feature.icon}
                      />
                    </div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <div>{feature.description}</div>
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
              <div className={styles.column} key={quote.name}>
                <img
                  alt={quote.name}
                  className={styles.quoteThumbnail}
                  src={quote.thumbnail}
                />
                <h3 className={styles.quoteName}>{quote.name}</h3>
                <h4 className={styles.quoteTitle}>{quote.title}</h4>
                <div className={styles.quoteText}>{quote.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
