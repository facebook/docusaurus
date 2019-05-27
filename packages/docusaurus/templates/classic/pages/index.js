/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withBaseUrl from '@docusaurus/withBaseUrl';
import landingPage from './data';
import s from './s.module.css';

/* Note that this is only temporary. TODO: better welcome screen */
function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      /** this title will overwrite the one in config */
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={cx('hero hero--dark', s.header)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>

          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={s.buttons}>
            <button
              type="button"
              className={cx(
                'button button--outline button--primary button--lg',
                s.getStarted,
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
            className={s.logo}
            alt="logo"
          />
        </div>
      </header>
      <main>
        {landingPage.highlights && landingPage.highlights.length && (
          <section className={s.highlights}>
            <div className="container">
              <div className="row">
                {landingPage.highlights.map(
                  ({imageUrl, title, description}, idx) => (
                    <div
                      key={`landing-page-highlight-${idx}`}
                      className={cx(s.col4, s.highlight)}>
                      <img src={imageUrl} alt={title} />
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>
        )}

        {landingPage.features && landingPage.features.length && (
          <section className={cx('container', s.features)}>
            {/**
             * TODO: Include most of the use cases as references
             * */}
            {landingPage.features.map(({title, imageUrl, description}, idx) => (
              <div
                key={`landing-page-feature-${idx}`}
                className={cx(s.feature)}>
                <img src={imageUrl} alt={title} />
                <h3>{title}</h3>
                <div dangerouslySetInnerHTML={{__html: description}} />
              </div>
            ))}
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
