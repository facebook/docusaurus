/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withBaseUrl from '@docusaurus/withBaseUrl';
import styles from './styles.module.css';

const highlights = [
  {
    title: 'Focus on your docs',
    imageUrl: 'http://docusaurus-2.netlify.com/img/undraw_typewriter.svg',
    description:
      "Docusaurus lets you focus on your docs, and we'll do the chores. Now go ahead and dump all your docs into the docs directory.",
  },
  {
    title: 'Supports versioned docs',
    imageUrl: 'http://docusaurus-2.netlify.com/img/undraw_version_control.svg',
    description:
      'Support users on all versions of your project. Document versioning helps you keep documentation in sync with project releases.',
  },
  {
    title: 'Supports i18n',
    imageUrl: 'http://docusaurus-2.netlify.com/img/undraw_around_the_world.svg',
    description:
      'Localization comes pre-configured. Use Crowdin to translate your docs into over 70 languages.',
  },
];

/* Note that this is only temporary. TODO: better welcome screen */
function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      /** this title will overwrite the one in config */
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--dark', styles.header)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>

          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <button
              type="button"
              className={classnames(
                'button button--outline button--primary button--lg',
                styles.getStarted,
              )}>
              Get Started
            </button>
            <iframe
              src="https://ghbtns.com/github-btn.html?user=facebook&amp;repo=docusaurus&amp;type=star&amp;count=true&amp;size=large"
              frameBorder={0}
              scrolling={0}
              width={160}
              height={30}
              title="GitHub Stars"
            />
          </div>
          <img
            src={withBaseUrl('img/logo.svg')}
            className={styles.logo}
            alt="logo"
          />
        </div>
      </header>
      <main>
        {highlights && highlights.length && (
          <section className={styles.highlights}>
            <div className="container">
              <div className="row">
                {highlights.map(({imageUrl, title, description}, idx) => (
                  <div
                    key={`landing-page-highlight-${idx}`}
                    className={classnames(styles.col4, styles.highlight)}>
                    <img src={imageUrl} alt={title} />
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
