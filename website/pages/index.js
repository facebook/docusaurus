/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext, useEffect} from 'react';
import Head from '@docusaurus/Head';
import DocusaurusContext from '@docusaurus/context';
import Link from '@docusaurus/Link';

import classnames from 'classnames';

import styles from './styles.module.css';

const QUOTES = [
  {
    thumbnail: 'img/christopher-chedeau.jpg',
    name: 'Christopher "vjeux" Chedeau',
    title: 'Lead Prettier Developer',
    text: (
      <>
        I&apos;ve helped open source many projects at Facebook and every one
        needed a website. They all had very similar constraints: the
        documentation should be written in markdown and be deployed via GitHub
        pages. None of the existing solutions were great, so I hacked my own and
        then forked it whenever we needed a new website. I’m so glad that
        Docusaurus now exists so that I don’t have to spend a week each time
        spinning up a new one.
      </>
    ),
  },
  {
    thumbnail: 'img/hector-ramos.png',
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
    thumbnail: 'img/ricky-vetter.jpg',
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

function Home() {
  const context = useContext(DocusaurusContext);
  const {siteConfig = {}} = context;

  // TODO: (wrapper function) API so that user won't need to concatenate url manually
  const feedbackUrl = `${siteConfig.baseUrl}feedback/`;
  const gettingStartedUrl = `${siteConfig.baseUrl}docs/installation`;

  useEffect(() => {
    // Prefetch feedback pages & getting started pages
    window.docusaurus.prefetch(feedbackUrl);
    window.docusaurus.prefetch(gettingStartedUrl);
  }, []);

  return (
    <div>
      <Head>
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
            <Link
              className={styles['index-ctas-get-started-button']}
              to={gettingStartedUrl}>
              Get Started
            </Link>
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
          <Link to={feedbackUrl}>here</Link>!
        </div>
      </div>
      <div className={styles.section}>
        <div className="container text--center margin-bottom--xl">
          <div className="row">
            <div className="col">
              <img
                className={styles.featureImage}
                src={`${siteConfig.baseUrl}img/undraw_typewriter.svg`}
              />
              <h3>Powered by Markdown</h3>
              <p className="padding-horiz--md">
                Save time and focus on your project's documentation. Simply
                write docs and blog posts with Markdown and Docusaurus will
                publish a set of static html files ready to serve.
              </p>
            </div>
            <div className="col">
              <img
                className={styles.featureImage}
                src={`${siteConfig.baseUrl}img/undraw_react.svg`}
              />
              <h3>Built Using React</h3>
              <p className="padding-horiz--md">
                Extend or customize your project's layout by reusing React.
                Docusaurus can be extended while reusing the same header and
                footer.
              </p>
            </div>
            <div className="col">
              <img
                className={styles.featureImage}
                src={`${siteConfig.baseUrl}img/undraw_around_the_world.svg`}
              />
              <h3>Ready for Translations</h3>
              <p className="padding-horiz--md">
                Localization comes pre-configured. Use Crowdin to translate your
                docs into over 70 languages.
              </p>
            </div>
          </div>
        </div>
        <div className="container text--center">
          <div className="row">
            <div className="col col--4 col--offset-2">
              <img
                className={styles.featureImage}
                src={`${siteConfig.baseUrl}img/undraw_version_control.svg`}
              />
              <h3>Document Versioning</h3>
              <p className="padding-horiz--md">
                Support users on all versions of your project. Document
                versioning helps you keep documentation in sync with project
                releases.
              </p>
            </div>
            <div className="col col--4">
              <img
                className={styles.featureImage}
                src={`${siteConfig.baseUrl}img/undraw_algolia.svg`}
              />
              <h3>Document Search</h3>
              <p className="padding-horiz--md">
                Make it easy for your community to find what they need in your
                documentation. We proudly support Algolia documentation search.
              </p>
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
        <div className="container">
          <div className="row">
            {QUOTES.map(quote => (
              <div className="col" key={quote.name}>
                <div className="avatar avatar--vertical margin-bottom--sm">
                  <img
                    alt={quote.name}
                    className="avatar__photo avatar__photo--xl"
                    src={`${siteConfig.baseUrl}${quote.thumbnail}`}
                  />
                  <div className="avatar__intro">
                    <h4 className="avatar__name">{quote.name}</h4>
                    <small className="avatar__subtitle">{quote.title}</small>
                  </div>
                </div>
                <p className="text--center text--italic padding-horiz--md">
                  {quote.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
