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
import VersionsArchived from './versionsArchived.json';
import PrismLight from './src/utils/prismLight';
import PrismDark from './src/utils/prismDark';
import type * as Preset from '@docusaurus/preset-classic';
// TODO remove this eslint ruse
// TODO PrismDark and PrismLight types
// TODO  `satisfies Preset.ThemeConfig`  `satisfies Config`
// results Expected ';', got 'satisfies'
/* eslint-disable @docusaurus/no-untranslated-text */
const ArchivedVersionsDropdownItems = Object.entries(VersionsArchived).splice(
  0,
  5,
);
const isDev = process.env.NODE_ENV === 'development';

export default {
  announcementBar: {
    id: 'announcementBar-3', // Increment on change
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
    copyright: `Copyright © ${new Date().getFullYear()} Meta Platforms, Inc. Built with Docusaurus.`,
  },
  navbar: {
    hideOnScroll: true,
    title: 'Docusaurus',
    logo: {
      alt: '',
      src: 'img/docusaurus.svg',
      srcDark: 'img/docusaurus_keytar.svg',
      width: 32,
      height: 32,
    },
    items: [
      {
        type: 'doc',
        position: 'left',
        docId: 'introduction',
        label: 'Docs',
      },
      {
        type: 'docSidebar',
        position: 'left',
        sidebarId: 'api',
        label: 'API',
      },
      {to: 'blog', label: 'Blog', position: 'left'},
      {to: 'showcase', label: 'Showcase', position: 'left'},
      {
        to: '/community/support',
        label: 'Community',
        position: 'left',
        activeBaseRegex: `/community/`,
      },
      // This item links to a draft doc: only displayed in dev
      {
        type: 'doc',
        docId: 'index',
        label: 'Tests',
        docsPluginId: 'docs-tests',
      },
      isDev && {to: '/__docusaurus/debug', label: 'Debug'},
      // Custom item for dogfooding: only displayed in /tests/ routes
      {
        type: 'custom-dogfood-navbar-item',
        content: '😉',
      },
      // Right
      {
        type: 'docsVersionDropdown',
        position: 'right',
        dropdownActiveClassDisabled: true,
        dropdownItemsAfter: [
          {
            type: 'html',
            value: '<hr class="dropdown-separator">',
          },
          {
            type: 'html',
            className: 'dropdown-archived-versions',
            value: '<b>Archived versions</b>',
          },
          ...ArchivedVersionsDropdownItems.map(([versionName, versionUrl]) => ({
            label: versionName,
            href: versionUrl,
          })),
          {
            href: 'https://v1.docusaurus.io',
            label: '1.x.x',
          },
          {
            type: 'html',
            value: '<hr class="dropdown-separator">',
          },
          {
            to: '/versions',
            label: 'All versions',
          },
        ],
        dropdownItemsBefore: [],
      },
      {
        type: 'localeDropdown',
        position: 'right',
        dropdownItemsAfter: [
          {
            type: 'html',
            value: '<hr style="margin: 0.3rem 0;">',
          },
          {
            href: 'https://github.com/facebook/docusaurus/issues/3526',
            label: 'Help Us Translate',
          },
        ],
        dropdownItemsBefore: [],
      },
      {
        href: 'https://github.com/facebook/docusaurus',
        position: 'right',
        className: 'header-github-link',
        'aria-label': 'GitHub repository',
      },
    ]
      // TODO fix type
      .filter(Boolean) as NonNullable<Preset.ThemeConfig['navbar']>['items'],
  },
};
// satisfies Preset.ThemeConfig;
