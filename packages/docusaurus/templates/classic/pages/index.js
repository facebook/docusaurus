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
import s from './s.module.css';

/* Note that this is only temporary. TODO: better welcome screen */
function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout title="Hello">
      <header className={s.header}>
        <div className="container">
          <h1>{siteConfig.title}</h1>
          <p>{siteConfig.tagline}</p>
          <button
            type="button"
            className="button button--outline button--primary">
            Get Started
          </button>
          <div>
            <img
              src={withBaseUrl('img/logo.svg')}
              className={s.logo}
              alt="logo"
            />
          </div>
        </div>
      </header>
      <main>
        <section className={s.highlights}>
          <div className="container">
            <div className="row">
              <div className={cx(s.col4, s.highlight)}>
                <img
                  src="http://docusaurus-2.netlify.com/img/undraw_typewriter.svg"
                  alt="Focus on your docs"
                />
                <h3>Focus on your docs</h3>
                <p>
                  Docusaurus lets you focus on your docs, and we&apos;ll do the
                  chores. Now go ahead and dump all your docs into the{' '}
                  <code>docs/</code> directory.
                </p>
              </div>
              <div className={cx(s.col4, s.highlight)}>
                <img
                  src="http://docusaurus-2.netlify.com/img/undraw_version_control.svg"
                  alt="Supports versioned docs"
                />
                <h3>Versioned docs</h3>
                <p>TODO: come up with some nonsense on versioned docs</p>
              </div>
              <div className={cx(s.col4, s.highlight)}>
                <img
                  src="http://docusaurus-2.netlify.com/img/undraw_around_the_world.svg"
                  alt="Support i18n"
                />
                <h3>i18n</h3>
                <p>
                  Fun fact about React: Their docs site is powered by a ton of
                  repos, one for each language, because their site doesn&apos;t
                  support i18n. We do{' '}
                  <span role="img" aria-label="languages">
                    {' '}
                    🇺🇸🇨🇳🇸🇬🇯🇵{' '}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={cx('container', s.features)}>
          {/**
           * TODO: Include most of the use cases as references
           * */}
          <h2>features</h2>
        </section>
        <section className={cx('container', s.users)}>
          <h2>users</h2>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
