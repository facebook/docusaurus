/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl, {useBaseUrlUtils} from '@docusaurus/useBaseUrl';

import Image from '@theme/IdealImage';
import Layout from '@theme/Layout';

import Tweet from '@site/src/components/Tweet';
import Tweets, {type TweetItem} from '@site/src/data/tweets';
import Quotes from '@site/src/data/quotes';
import Features, {type FeatureItem} from '@site/src/data/features';
import Heading from '@theme/Heading';

import styles from './styles.module.css';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

function HeroBanner() {
  return (
    <div className={styles.hero} data-theme="dark">
      <div className={styles.heroInner}>
        <Heading as="h1" className={styles.heroProjectTagline}>
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
        </Heading>
        <div className={styles.indexCtas}>
          <Link className="button button--primary" to="/docs">
            <Translate>Get Started</Translate>
          </Link>
          <Link className="button button--info" to="https://docusaurus.new">
            <Translate>Try a Demo</Translate>
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
  );
}

function TweetsSection() {
  const items = useMemo(
    () => Tweets.filter((t) => t.showOnHomepage).slice(0, 9),
    [],
  );
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState<TweetItem | null>(null);
  const [origin, setOrigin] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [toCenter, setToCenter] = useState(false);
  const [allOpen, setAllOpen] = useState(false);
  const overlayCardRef = useRef<HTMLDivElement | null>(null);
  const baseSpeed = 30;
  const speedRef = useRef(0);
  const offsetRef = useRef(0);
  const reduceMotionRef = useRef(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      reduceMotionRef.current = mq.matches;
      const onChange = (e: MediaQueryListEvent) => {
        reduceMotionRef.current = e.matches;
      };
      mq.addEventListener?.('change', onChange);
      return () => mq.removeEventListener?.('change', onChange);
    }
    return undefined;
  }, []);
  useEffect(() => {
    if (!trackRef.current || !firstSetRef.current) {
      return () => {};
    }
    let raf = 0;
    let last = 0;
    const tick = (ts: number) => {
      if (!last) {
        last = ts;
      }
      const dt = (ts - last) / 1000;
      last = ts;
      const target =
        hovered || reduceMotionRef.current || active || allOpen ? 0 : baseSpeed;
      speedRef.current += (target - speedRef.current) * 0.08;
      offsetRef.current -= speedRef.current * dt;
      const firstWidth = firstSetRef.current!.offsetWidth;
      if (offsetRef.current <= -firstWidth) {
        offsetRef.current += firstWidth;
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovered, active, allOpen]);
  useEffect(() => {
    if (!active || !origin) {
      return;
    }
    const el = overlayCardRef.current;
    if (!el) {
      return;
    }
    const fr = el.getBoundingClientRect();
    const fx = origin.x + origin.w / 2 - (fr.left + fr.width / 2);
    const fy = origin.y + origin.h / 2 - (fr.top + fr.height / 2);
    const fs = origin.w / fr.width;
    el.style.setProperty('--from-x', `${fx}px`);
    el.style.setProperty('--from-y', `${fy}px`);
    el.style.setProperty('--from-s', String(fs));
    setToCenter(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setToCenter(true)));
  }, [active, origin]);

  return (
    <div className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <div className={styles.tweetsHeader}>
          <Heading as="h2" className={styles.tweetsTitle}>
            <Translate>Loved by many engineers</Translate>
          </Heading>
          <button
            type="button"
            className={clsx(
              'button',
              'button--secondary',
              'button--sm',
              styles.tweetsViewAll,
            )}
            onClick={() => {
              setActive(null);
              setAllOpen(true);
            }}>
            <svg
              className={styles.tweetsViewAllIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 8v-8h8v8h-8z" />
            </svg>
            <span>
              <Translate>View all</Translate>
            </span>
          </button>
        </div>
        <div
          className={styles.tweetsMarquee}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            setActive(null);
          }}>
          <div
            className={styles.tweetsTrack}
            ref={trackRef}
            role="list"
            aria-label="Testimonials carousel">
            <div className={styles.tweetsSet} ref={firstSetRef}>
              {items.map((tweet, _i) => (
                <div
                  className={styles.tweetItem}
                  role="listitem"
                  key={tweet.url}
                  onMouseEnter={(e) => {
                    const r = (
                      e.currentTarget as HTMLDivElement
                    ).getBoundingClientRect();
                    setOrigin({x: r.left, y: r.top, w: r.width, h: r.height});
                    setActive(tweet);
                  }}>
                  <Tweet {...tweet} />
                </div>
              ))}
            </div>
            <div className={styles.tweetsSet} aria-hidden="true">
              {items.map((tweet, _i) => (
                <div
                  className={styles.tweetItem}
                  role="presentation"
                  key={`dup-${tweet.url}`}
                  onMouseEnter={(e) => {
                    const r = (
                      e.currentTarget as HTMLDivElement
                    ).getBoundingClientRect();
                    setOrigin({x: r.left, y: r.top, w: r.width, h: r.height});
                    setActive(tweet);
                  }}>
                  <Tweet {...tweet} />
                </div>
              ))}
            </div>
          </div>
          <div
            className={clsx(
              styles.tweetsOverlay,
              active && styles.tweetsOverlayVisible,
              toCenter && styles.tweetsOverlayAnim,
            )}>
            {active && (
              <div
                ref={overlayCardRef}
                className={styles.tweetsOverlayCard}
                onMouseLeave={() => {
                  setToCenter(false);
                  setTimeout(() => {
                    setActive(null);
                    setOrigin(null);
                  }, 300);
                }}>
                <Tweet {...active} />
              </div>
            )}
          </div>
          <div
            className={clsx(
              styles.tweetsAllOverlay,
              allOpen && styles.tweetsAllVisible,
            )}>
            <div
              className={styles.tweetsAllPanel}
              role="dialog"
              aria-modal="true">
              <div className={styles.tweetsAllHeader}>
                <Heading as="h3" className={styles.tweetsAllTitle}>
                  <Translate>All testimonials</Translate>
                </Heading>
                <button
                  type="button"
                  className={clsx(
                    'button',
                    'button--secondary',
                    'button--sm',
                    styles.tweetsAllClose,
                  )}
                  aria-label="Close"
                  onClick={() => setAllOpen(false)}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true">
                    <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.41 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.29-6.3z" />
                  </svg>
                </button>
              </div>
              <div className={styles.tweetsAllGrid}>
                {items.map((tweet) => (
                  <div
                    key={`all-${tweet.url}`}
                    className={styles.tweetsAllItem}>
                    <Tweet {...tweet} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuotesSection() {
  return (
    <div className={clsx(styles.section)}>
      <div className="container">
        <div className="row">
          {Quotes.map((quote) => (
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
  );
}

function VideoContainer() {
  return (
    <div className="container text--center margin-top--xl">
      <div className="row">
        <div className="col">
          <Heading as="h2">
            <Translate>Check it out in the intro video</Translate>
          </Heading>
          <div className="video-container">
            <LiteYouTubeEmbed
              id="_An9EsKPhp0"
              params="autoplay=1&autohide=1&showinfo=0&rel=0"
              title="Explain Like I'm 5: Docusaurus"
              poster="maxresdefault"
              webp
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  feature,
  className,
}: {
  feature: FeatureItem;
  className?: string;
}) {
  const {withBaseUrl} = useBaseUrlUtils();

  return (
    <div className={clsx('col', className)}>
      <img
        className={styles.featureImage}
        alt={feature.title}
        width={Math.floor(feature.image.width)}
        height={Math.floor(feature.image.height)}
        src={withBaseUrl(feature.image.src)}
        loading="lazy"
      />
      <Heading as="h3" className={clsx(styles.featureHeading)}>
        {feature.title}
      </Heading>
      <p className="padding-horiz--md">{feature.text}</p>
    </div>
  );
}

function FeaturesContainer() {
  const firstRow = Features.slice(0, 3);
  const secondRow = Features.slice(3);

  return (
    <div className="container text--center">
      <div className="row margin-top--lg margin-bottom--lg">
        {firstRow.map((feature, idx) => (
          <Feature feature={feature} key={idx} />
        ))}
      </div>
      <div className="row">
        {secondRow.map((feature, idx) => (
          <Feature
            feature={feature}
            key={idx}
            className={clsx('col--4', idx === 0 && 'col--offset-2')}
          />
        ))}
      </div>
    </div>
  );
}

function TopBanner() {
  // TODO We should be able to strongly type customFields
  //  Refactor to use a CustomFields interface + TS declaration merging
  const announcedVersion = useDocusaurusContext().siteConfig.customFields
    ?.announcedVersion as string;

  return (
    <div className={styles.topBanner}>
      <div className={styles.topBannerTitle}>
        {'🎉\xa0'}
        <Link
          to={`/blog/releases/${announcedVersion}`}
          className={styles.topBannerTitleText}>
          <Translate
            id="homepage.banner.launch.newVersion"
            values={{newVersion: announcedVersion}}>
            {'Docusaurus\xa0{newVersion} is\xa0out!️'}
          </Translate>
        </Link>
        {'\xa0🥳'}
      </div>
      {/*
      <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
        <div style={{flex: 1, whiteSpace: 'nowrap'}}>
          <div className={styles.topBannerDescription}>
            We are on{' '}
            <b>
              <Link to="https://www.producthunt.com/posts/docusaurus-2-0">
                ProductHunt
              </Link>{' '}
              and{' '}
              <Link to="https://news.ycombinator.com/item?id=32303052">
                Hacker News
              </Link>{' '}
              today!
            </b>
          </div>
        </div>
        <div
          style={{
            flexGrow: 1,
            flexShrink: 0,
            padding: '0.5rem',
            display: 'flex',
            justifyContent: 'center',
          }}>
          <ProductHuntCard />
          <HackerNewsIcon />
        </div>
      </div>
      */}
    </div>
  );
}

export default function Home(): ReactNode {
  const {
    siteConfig: {customFields, tagline},
  } = useDocusaurusContext();
  const {description} = customFields as {description: string};
  return (
    <Layout title={tagline} description={description}>
      <main>
        <TopBanner />
        <HeroBanner />
        <div className={styles.section}>
          <FeaturesContainer />
          <VideoContainer />
        </div>
        <TweetsSection />
        <QuotesSection />
      </main>
    </Layout>
  );
}
