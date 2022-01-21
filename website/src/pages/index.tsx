/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable global-require */

import React from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Image from '@theme/IdealImage';
import Layout from '@theme/Layout';

import Tweet from '@site/src/components/Tweet';
import clsx from 'clsx';

import styles from './styles.module.css';

const QUOTES = [
  {
    thumbnail: require('../data/quotes/christopher-chedeau.jpg'),
    name: 'Christopher "vjeux" Chedeau',
    title: translate({
      id: 'homepage.quotes.christopher-chedeau.title',
      message: 'Lead Prettier Developer',
      description: 'Title of quote of Christopher Chedeau on the home page',
    }),
    text: (
      <Translate
        id="homepage.quotes.christopher-chedeau"
        description="Quote of Christopher Chedeau on the home page">
        I&apos;ve helped open source many projects at Facebook and every one
        needed a website. They all had very similar constraints: the
        documentation should be written in markdown and be deployed via GitHub
        pages. I’m so glad that Docusaurus now exists so that I don’t have to
        spend a week each time spinning up a new one.
      </Translate>
    ),
  },
  {
    thumbnail: require('../data/quotes/hector-ramos.jpg'),
    name: 'Hector Ramos',
    title: translate({
      id: 'homepage.quotes.hector-ramos.title',
      message: 'Lead React Native Advocate',
      description: 'Title of quote of Hector Ramos on the home page',
    }),
    text: (
      <Translate
        id="homepage.quotes.hector-ramos"
        description="Quote of Hector Ramos on the home page">
        Open source contributions to the React Native docs have skyrocketed
        after our move to Docusaurus. The docs are now hosted on a small repo in
        plain markdown, with none of the clutter that a typical static site
        generator would require. Thanks Slash!
      </Translate>
    ),
  },
  {
    thumbnail: require('../data/quotes/ricky-vetter.jpg'),
    name: 'Ricky Vetter',
    title: translate({
      id: 'homepage.quotes.risky-vetter.title',
      message: 'ReasonReact Developer',
      description: 'Title of quote of Ricky Vetter on the home page',
    }),
    text: (
      <Translate
        id="homepage.quotes.risky-vetter"
        description="Quote of Ricky Vetter on the home page">
        Docusaurus has been a great choice for the ReasonML family of projects.
        It makes our documentation consistent, i18n-friendly, easy to maintain,
        and friendly for new contributors.
      </Translate>
    ),
  },
];

function TweetsSection() {
  return (
    <div className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <h2 className={clsx('margin-bottom--lg', 'text--center')}>
          Loved by many engineers
        </h2>
        <div className={clsx('row', styles.tweetsSection)}>
          <div className="col col--4">
            <Tweet
              url="https://twitter.com/kentcdodds/status/1323806816019468288"
              handle="kentcdodds"
              name="Kent C. Dodds"
              date="Nov 4, 2020"
              avatar="https://pbs.twimg.com/profile_images/1444988463216922631/IDffhy4i_400x400.jpg"
              content={
                <>
                  http://testing-library.com just got a nice update! We&apos;re
                  now on the latest version of @docusaurus thanks to @matanbobi,
                  @TensorNo, and @nickemccurdy 💙
                  <br />
                  <br />
                  My favorite new feature: dark mode!! 🌑/☀️
                </>
              }
            />
            <Tweet
              url="https://twitter.com/swyx/status/1454261201207054339"
              handle="swyx"
              name="swyx"
              date="Oct 30, 2021"
              avatar="https://pbs.twimg.com/profile_images/1456506127961640962/iM2Hf8du_400x400.jpg"
              content={
                <>
                  Soft shipped the new https://docs.temporal.io
                  <br />
                  <br />
                  Many thanks to @thisismahmoud_, @flossypurse, @taillogs and
                  others, and built with @docusaurus and now @tailwindcss
                  <br />
                  <br />
                  Shipped fearlessly on Friday afternoon thanks to @Netlify
                  immutable deploys Flexed biceps
                </>
              }
            />
            <Tweet
              url="https://twitter.com/paularmstrong/status/1387059593373700100"
              handle="paularmstrong"
              name="Paul Armstrong"
              date="Apr 27, 2021"
              avatar="https://pbs.twimg.com/profile_images/823614982394769408/C4KgET17_400x400.jpg"
              content={
                <>
                  Continue to be impressed and excited about Docusaurus v2 alpha
                  releases. Already using the sidebar items generator to help
                  monorepo workspace devs create their own doc pages without any
                  configuration needed.
                </>
              }
            />
            <Tweet
              url="https://twitter.com/iansu/status/1184149586048245760"
              handle="iansu"
              name="Ian Sutherland"
              date="Oct 16, 2019"
              avatar="https://pbs.twimg.com/profile_images/916780671552516096/yzDVUVKY_400x400.jpg"
              content={
                <>
                  We just updated the Create React App docs to Docusaurus v2.
                  Now with dark mode! 😎
                  <br />
                  <br />
                  Thanks to the @docusaurus team for their help! ❤️
                  <br />
                  <br />
                  https://create-react-app.dev
                </>
              }
            />
            <Tweet
              url="https://twitter.com/biantris_/status/1480259279487741953"
              handle="biantris_"
              name="biazita"
              date="Jan 10, 2022"
              avatar="https://pbs.twimg.com/profile_images/1371525161829208064/UCzm0Zye_400x400.jpg"
              content={
                <>
                  Today I tried @docusaurus in a project, I really like the ease
                  and speed of developing with it \o/
                </>
              }
            />
          </div>
          <div className="col col--4">
            <Tweet
              url="https://twitter.com/sebastienlorber/status/1321784071815680000"
              handle="sebastienlorber"
              name="Sebastien Lorber"
              date="Oct 29, 2020"
              avatar="https://pbs.twimg.com/profile_images/573206276819140608/gKAusMeX_400x400.jpeg"
              content={
                <>
                  🥳🎊🥳🎊🥳🎊🥳🎊 The @reactnative website just migrated to
                  @docusaurus v2
                  <br />
                  Some obvious changes: <br />
                  🌔 Dark mode <br />
                  ⚡️ SPA navigation / prefetching <br />
                  🧐 @algolia DocSearch v3 <br />
                  💥 @mdx_js enable many new possibilities <br />
                  <br />
                  Check it out: http://reactnative.dev
                </>
              }
            />
            <Tweet
              url="https://twitter.com/rachelnabors/status/1321787416089366529"
              handle="rachelnabors"
              name="R 'Nearest' Nabors 💙"
              date="Oct 29, 2020"
              avatar="https://pbs.twimg.com/profile_images/1316805792893489152/7soY-vhs_400x400.jpg"
              content={
                <>
                  Many thanks to @sebastienlorber and @simek for their tireless
                  effort to migrate @reactnative &apos;s documentation to
                  @docusaurus v2! The new site is better than ever! Thank you to
                  everyone who makes these docs shine &lt;3
                </>
              }
            />
            <Tweet
              url="https://twitter.com/mweststrate/status/1181276252293853186"
              handle="mweststrate"
              name="Michel Weststrate"
              date="Oct 8, 2019"
              avatar="https://pbs.twimg.com/profile_images/1192174732189339649/NYGFeR-K_400x400.jpg"
              content={
                <>
                  New #mobx docs are online! More modern, fixing many UI issues.
                  <br />
                  <br />
                  👏 @cloverich did the awesome job of migrating from ancient
                  gitbook -&gt; @docusaurus! 👏 <br />
                  <br />
                  No real content updates yet, but contributing and publishing
                  has become way easier
                </>
              }
            />
            <Tweet
              url="https://twitter.com/verdaccio_npm/status/1420187249145118722"
              handle="verdaccio_npm"
              name="verdaccio"
              date="Jul 28, 2021"
              avatar="https://pbs.twimg.com/profile_images/1423143362232823809/4khdTyVZ_400x400.png"
              content={
                <>
                  The new website has landed 🚀 powered by @docusaurus v2 and
                  made by @_semoal kudos to him 👏 #verdaccio #nodejs awesome
                  contribution ❤️‍🔥 (video made with react remotion @JNYBGR )
                  all Open Source and hosted on @Netlify https://verdaccio.org
                </>
              }
            />
          </div>
          <div className="col col--4">
            <Tweet
              url="https://twitter.com/acemarke/status/1452725153998245891"
              handle="acemarke"
              name="Mark Erikson"
              date="Oct 26, 2021"
              avatar="https://pbs.twimg.com/profile_images/842582724737163264/tFKLiJI5_400x400.jpg"
              content={
                <>
                  We&apos;ve been using Docusaurus for all the Redux org docs
                  sites for the last couple years, and it&apos;s great!
                  We&apos;ve been able to focus on content, customize some
                  presentation and features, and It Just Works.
                </>
              }
            />
            <Tweet
              url="https://twitter.com/yangshunz/status/1284536949718478848"
              handle="yangshunz"
              name="Yangshun Tay"
              date="Jul 19, 2020"
              avatar="https://pbs.twimg.com/profile_images/1247950572096868352/3kuZJz5j_400x400.jpg"
              content={
                <>
                  I made a @docusaurus website for answers to the H5BP Front End
                  Interview Questions! Hopefully it makes the browsing
                  experience easier - https://frontendinterviewhandbook.com
                </>
              }
            />
            <Tweet
              url="https://twitter.com/johnny_reilly/status/1469238609266028545"
              handle="johnny_reilly"
              name="John Reilly"
              date="Dec 10, 2021"
              avatar="https://pbs.twimg.com/profile_images/552803871567790081/rPdTN64o_400x400.jpeg"
              content={
                <>
                  I ❤️ @docusaurus - it makes it so easy to spin up docs, blogs
                  and simple websites. I&apos;ve used it to:
                  <br />
                  <br /> ✅ Replatform my blog with GitHub pages <br />
                  ✅ Build a website for a local business <br />✅ Build
                  internal facing blog/docs sites with @AzureStaticApps
                </>
              }
            />
            <Tweet
              url="https://twitter.com/pierregillesl/status/1372839188698001408"
              handle="pierregillesl"
              name="
        Pierre-Gilles Leymarie"
              date="Mar 19, 2021"
              avatar="https://pbs.twimg.com/profile_images/1302550637197000705/pg5XF8rA_400x400.jpg"
              content={
                <>
                  Just upgraded our website to @docusaurus latest with
                  internationalization support 🥳
                  <br />
                  <br />
                  Before that, we had to build 2 separate versions of the
                  website to get it in English + French.
                  <br />
                  <br />
                  Now, it&apos;s working out of the box, with proper meta tags
                  for SEO 👌
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Home(): JSX.Element {
  const {
    siteConfig: {customFields, tagline},
  } = useDocusaurusContext();
  const {description} = customFields as {description: string};
  return (
    <Layout title={tagline} description={description}>
      <main>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroProjectTagline}>
              <img
                alt={translate({message: 'Docusaurus with Keytar'})}
                className={styles.heroLogo}
                src={useBaseUrl('/img/docusaurus_keytar.svg')}
                width="200"
                height="200"
              />
              <span
                className={styles.heroTitleTextHtml}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: translate({
                    id: 'homepage.hero.title',
                    message:
                      'Build <b>optimized</b> websites <b>quickly</b>, focus on your <b>content</b>',
                    description:
                      'Home page hero title, can contain simple html tags',
                  }),
                }}
              />
            </h1>
            <div className={styles.indexCtas}>
              <Link className="button button--primary" to="/docs">
                <Translate>Get Started</Translate>
              </Link>
              <Link className="button button--info" to="https://docusaurus.new">
                <Translate>Playground</Translate>
              </Link>
              <span className={styles.indexCtasGitHubButtonWrapper}>
                <iframe
                  className={styles.indexCtasGitHubButton}
                  src="https://ghbtns.com/github-btn.html?user=facebook&amp;repo=docusaurus&amp;type=star&amp;count=true&amp;size=large"
                  width={160}
                  height={30}
                  title="GitHub Stars"
                />
              </span>
            </div>
          </div>
        </div>
        <div className={clsx(styles.announcement, styles.announcementDark)}>
          <div className={styles.announcementInner}>
            <Translate
              values={{
                docusaurusV1Link: (
                  <Link to="https://v1.docusaurus.io/">
                    <Translate>Docusaurus v1</Translate>
                  </Link>
                ),
                migrationGuideLink: (
                  <Link to="/docs/migration">
                    <Translate>v1 to v2 migration guide</Translate>
                  </Link>
                ),
              }}>
              {`Coming from {docusaurusV1Link}? Check out our {migrationGuideLink}`}
            </Translate>
            .
          </div>
        </div>
        <div className={styles.section}>
          <div className="container text--center margin-bottom--xl">
            <div className="row">
              <div className="col">
                <img
                  className={styles.featureImage}
                  alt="Powered by MDX"
                  src={useBaseUrl('/img/undraw_typewriter.svg')}
                  width="1009.54"
                  height="717.96"
                />
                <h2 className={clsx(styles.featureHeading)}>
                  <Translate>Powered by Markdown</Translate>
                </h2>
                <p className="padding-horiz--md">
                  <Translate>
                    Save time and focus on your project&apos;s documentation.
                    Simply write docs and blog posts with Markdown/MDX and
                    Docusaurus will publish a set of static HTML files ready to
                    serve. You can even embed JSX components into your Markdown
                    thanks to MDX.
                  </Translate>
                </p>
              </div>
              <div className="col">
                <img
                  alt="Built Using React"
                  className={styles.featureImage}
                  src={useBaseUrl('/img/undraw_react.svg')}
                  width="1108"
                  height="731.18"
                />
                <h2 className={clsx(styles.featureHeading)}>
                  <Translate>Built Using React</Translate>
                </h2>
                <p className="padding-horiz--md">
                  <Translate>
                    Extend or customize your project&apos;s layout by reusing
                    React. Docusaurus can be extended while reusing the same
                    header and footer.
                  </Translate>
                </p>
              </div>
              <div className="col">
                <img
                  alt="Ready for Translations"
                  className={styles.featureImage}
                  src={useBaseUrl('/img/undraw_around_the_world.svg')}
                  width="1137"
                  height="776.59"
                />
                <h2 className={clsx(styles.featureHeading)}>
                  <Translate>Ready for Translations</Translate>
                </h2>
                <p className="padding-horiz--md">
                  <Translate>
                    Localization comes pre-configured. Use Crowdin to translate
                    your docs into over 70 languages.
                  </Translate>
                </p>
              </div>
            </div>
          </div>
          <div className="container text--center">
            <div className="row">
              <div className="col col--4 col--offset-2">
                <img
                  alt="Document Versioning"
                  className={styles.featureImage}
                  src={useBaseUrl('/img/undraw_version_control.svg')}
                  width="1038.23"
                  height="693.31"
                />
                <h2 className={clsx(styles.featureHeading)}>
                  <Translate>Document Versioning</Translate>
                </h2>
                <p className="padding-horiz--md">
                  <Translate>
                    Support users on all versions of your project. Document
                    versioning helps you keep documentation in sync with project
                    releases.
                  </Translate>
                </p>
              </div>
              <div className="col col--4">
                <img
                  alt="Document Search"
                  className={styles.featureImage}
                  src={useBaseUrl('/img/undraw_algolia.svg')}
                  width="1137.97"
                  height="736.21"
                />
                <h2 className={clsx(styles.featureHeading)}>
                  <Translate>Content Search</Translate>
                </h2>
                <p className="padding-horiz--md">
                  <Translate>
                    Make it easy for your community to find what they need in
                    your documentation. We proudly support Algolia documentation
                    search.
                  </Translate>
                </p>
              </div>
            </div>
          </div>
        </div>
        <TweetsSection />
        <div className={clsx(styles.section)}>
          <div className="container">
            <div className="row">
              {QUOTES.map((quote) => (
                <div className="col" key={quote.name}>
                  <div className="avatar avatar--vertical margin-bottom--sm">
                    <Image
                      alt={quote.name}
                      className="avatar__photo avatar__photo--xl"
                      img={quote.thumbnail}
                      style={{overflow: 'hidden'}}
                    />
                    <div className="avatar__intro padding-top--sm">
                      <div className="avatar__name">{quote.name}</div>
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
      </main>
    </Layout>
  );
}

export default Home;
