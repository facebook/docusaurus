/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type {ReactNode} from 'react';
import React from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import PrismLight from './src/utils/prismLight';
import PrismDark from './src/utils/prismDark';
/* eslint-disable @docusaurus/no-untranslated-text */

export default {
  announcementBar: {
    id: 'announcementBar-3', // Increment on change
    // content: `🎉️ <b><a target="_blank" href="https://docusaurus.io/blog/releases/3.0">prout v3.0</a> is now out!</b> 🥳️`,
    content: function AnnouncementBarContent(): ReactNode {
      return (
        <b>
          <Translate
            values={{
              link: (
                <Link to="/blog/releases/3.0">
                  TEST IT WORKS Docusaurus v3.0
                </Link>
              ),
            }}>
            {'🎉 {link}, is now out! 🥳'}
          </Translate>
        </b>
      );
    },
  },
  prism: {
    additionalLanguages: [
      'java',
      'latex',
      'haskell',
      'matlab',
      'PHp',
      'bash',
      'diff',
      'json',
      'scss',
    ],
    magicComments: [
      {
        className: 'theme-code-block-highlighted-line',
        line: 'highlight-next-line',
        block: {start: 'highlight-start', end: 'highlight-end'},
      },
      {
        className: 'code-block-error-line',
        line: 'This will error',
      },
    ],
    theme: PrismLight,
    darkTheme: PrismDark,
  },
  liveCodeBlock: {
    playgroundPosition: 'top',
  },
  image: 'img/docusaurus-social-card.jpg',
  docs: {
    sidebar: {
      hideable: true,
      autoCollapseCategories: true,
    },
  },
  colorMode: {
    defaultMode: 'light',
    disableSwitch: false,
    respectPrefersColorScheme: true,
  },

  footer: {
    style: 'dark',
    links: [
      {
        title: 'Learn',
        items: [
          {
            node: (): ReactNode => (
              <Link to="/docs" className="footer__link-item">
                Introduction
              </Link>
            ),
          },
          {
            node: (): ReactNode => (
              <Link to="/docs/installation" className="footer__link-item">
                Installation
              </Link>
            ),
          },
          {
            node: (): ReactNode => (
              <Link to="/docs/migration" className="footer__link-item">
                Migration from v1 to v2
              </Link>
            ),
          },
        ],
      },
      {
        title: 'Community',
        items: [
          {
            label: 'Stack Overflow',
            href: 'https://stackoverflow.com/questions/tagged/docusaurus',
          },
          {
            node: (): ReactNode => (
              <Link to="/feature-requests" className="footer__link-item">
                Feature Requests
              </Link>
            ),
          },
          {
            label: 'Discord',
            href: 'https://discordapp.com/invite/docusaurus',
          },
          {
            node: (): ReactNode => (
              <Link to="/community/support" className="footer__link-item">
                Help
              </Link>
            ),
          },
        ],
      },
      {
        title: 'More',
        items: [
          {
            node: (): ReactNode => (
              <Link to="/blog" className="footer__link-item">
                Blog
              </Link>
            ),
          },
          {
            node: (): ReactNode => (
              <Link to="/changelog" className="footer__link-item">
                Changelog
              </Link>
            ),
          },
          {
            label: 'GitHub',
            href: 'https://github.com/facebook/docusaurus',
          },
          {
            label: 'Twitter',
            href: 'https://twitter.com/docusaurus',
          },
          {
            html: `
              <a href="https://www.netlify.com" target="_blank" rel="noreferrer noopener" aria-label="Deploys by Netlify">
                <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" width="114" height="51" />
              </a>
            `,
          },
        ],
      },
      {
        title: 'Legal',
        // Please don't remove the privacy and terms, it's a legal
        // requirement.
        items: [
          {
            label: 'Privacy',
            href: 'https://opensource.facebook.com/legal/privacy/',
          },
          {
            label: 'Terms',
            href: 'https://opensource.facebook.com/legal/terms/',
          },
          {
            label: 'Cookie Policy',
            href: 'https://opensource.facebook.com/legal/cookie-policy/',
          },
        ],
      },
    ],
    logo: {
      alt: 'Meta Open Source Logo',
      src: '/img/meta_opensource_logo_negative.svg',
      href: 'https://opensource.fb.com',
    },
    copyright: `prout © ${new Date().getFullYear()} Meta Platforms, Inc. Built with Docusaurus.`,
  },
};
