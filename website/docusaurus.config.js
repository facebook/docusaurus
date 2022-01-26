/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @ts-check

const path = require('path');
const versions = require('./versions.json');
const math = require('remark-math');
const VersionsArchived = require('./versionsArchived.json');
const {dogfoodingPluginInstances} = require('./_dogfooding/dogfooding.config');
const npm2yarn = require('@docusaurus/remark-plugin-npm2yarn');

const ArchivedVersionsDropdownItems = Object.entries(VersionsArchived).splice(
  0,
  5,
);

// This probably only makes sense for the beta phase, temporary
function getNextBetaVersionName() {
  const expectedPrefix = '2.0.0-beta.';

  const lastReleasedVersion = versions[0];
  if (!lastReleasedVersion.includes(expectedPrefix)) {
    throw new Error(
      'this code is only meant to be used during the 2.0 beta phase.',
    );
  }
  const version = parseInt(lastReleasedVersion.replace(expectedPrefix, ''), 10);
  return `${expectedPrefix}${version + 1}`;
}

const allDocHomesPaths = [
  '/docs/',
  '/docs/next/',
  ...versions.slice(1).map((version) => `/docs/${version}/`),
];

const isDev = process.env.NODE_ENV === 'development';

const isDeployPreview =
  !!process.env.NETLIFY && process.env.CONTEXT === 'deploy-preview';

// Used to debug production build issues faster
const isBuildFast = !!process.env.BUILD_FAST;

const baseUrl = process.env.BASE_URL || '/';

// Special deployment for staging locales until they get enough translations
// https://app.netlify.com/sites/docusaurus-i18n-staging
// https://docusaurus-i18n-staging.netlify.app/
const isI18nStaging = process.env.I18N_STAGING === 'true';

const isVersioningDisabled = !!process.env.DISABLE_VERSIONING || isI18nStaging;

const TwitterSvg =
  '<svg style="fill: #1DA1F2; vertical-align: middle;" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Docusaurus',
  tagline: 'Build optimized websites quickly, focus on your content',
  organizationName: 'facebook',
  projectName: 'docusaurus',
  baseUrl,
  baseUrlIssueBanner: true,
  url: 'https://docusaurus.io',
  // Dogfood both settings:
  // - force trailing slashes for deploy previews
  // - avoid trailing slashes in prod
  trailingSlash: isDeployPreview,
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ',
      crossorigin: 'anonymous',
    },
  ],
  i18n: {
    defaultLocale: 'en',
    // eslint-disable-next-line no-nested-ternary
    locales: isDeployPreview
      ? // Deploy preview: keep it fast!
        ['en']
      : isI18nStaging
      ? // Staging locales: https://docusaurus-i18n-staging.netlify.app/
        ['en', 'ja']
      : // Production locales
        ['en', 'fr', 'pt-BR', 'ko', 'zh-CN'],
  },
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('esbuild-loader'),
      options: {
        loader: 'tsx',
        format: isServer ? 'cjs' : undefined,
        target: isServer ? 'node12' : 'es2017',
      },
    }),
  },
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/docusaurus.ico',
  customFields: {
    description:
      'An optimized site generator in React. Docusaurus helps you to move fast and write content. Build documentation websites, blogs, marketing pages, and more.',
  },
  staticDirectories: [
    'static',
    path.join(__dirname, '_dogfooding/_asset-tests'),
  ],
  themes: ['live-codeblock'],
  plugins: [
    [
      'content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      ({
        id: 'community',
        path: 'community',
        routeBasePath: 'community',
        editUrl: ({locale, versionDocsDirPath, docPath}) => {
          if (locale !== 'en') {
            return `https://crowdin.com/project/docusaurus-v2/${locale}`;
          }
          return `https://github.com/facebook/docusaurus/edit/main/website/${versionDocsDirPath}/${docPath}`;
        },
        editCurrentVersion: true,
        sidebarPath: require.resolve('./sidebarsCommunity.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      }),
    ],
    [
      'client-redirects',
      /** @type {import('@docusaurus/plugin-client-redirects').Options} */
      ({
        fromExtensions: ['html'],
        createRedirects(routePath) {
          // redirect to /docs from /docs/introduction,
          // as introduction has been made the home doc
          if (allDocHomesPaths.includes(routePath)) {
            return [`${routePath}/introduction`];
          }
          return [];
        },
        redirects: [
          {
            from: ['/docs/support', '/docs/next/support'],
            to: '/community/support',
          },
          {
            from: ['/docs/team', '/docs/next/team'],
            to: '/community/team',
          },
          {
            from: ['/docs/resources', '/docs/next/resources'],
            to: '/community/resources',
          },
        ],
      }),
    ],
    [
      'ideal-image',
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        // disableInDev: false,
      },
    ],
    [
      'pwa',
      {
        debug: isDeployPreview,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        // swRegister: false,
        swCustom: path.resolve(__dirname, 'src/sw.js'),
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: 'img/docusaurus.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: 'manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(37, 194, 160)',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#000',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: 'img/docusaurus.png',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: 'img/docusaurus.png',
            color: 'rgb(62, 204, 94)',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: 'img/docusaurus.png',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#000',
          },
        ],
      },
    ],
    ...dogfoodingPluginInstances,
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        debug: true, // force debug plugin usage
        docs: {
          // routeBasePath: '/',
          path: 'docs',
          sidebarPath: 'sidebars.js',
          // sidebarCollapsible: false,
          // sidebarCollapsed: true,
          editUrl: ({locale, docPath}) => {
            if (locale !== 'en') {
              return `https://crowdin.com/project/docusaurus-v2/${locale}`;
            }
            // We want users to submit doc updates to the upstream/next version!
            // Otherwise we risk losing the update on the next release.
            const nextVersionDocsDirPath = 'docs';
            return `https://github.com/facebook/docusaurus/edit/main/website/${nextVersionDocsDirPath}/${docPath}`;
          },
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [math, [npm2yarn, {sync: true}]],
          rehypePlugins: [],
          disableVersioning: isVersioningDisabled,
          lastVersion: isDev || isDeployPreview ? 'current' : undefined,
          onlyIncludeVersions: (() => {
            if (isBuildFast) {
              return ['current'];
            } else if (!isVersioningDisabled && (isDev || isDeployPreview)) {
              return ['current', ...versions.slice(0, 2)];
            }
            return undefined;
          })(),
          versions: {
            current: {
              label: `${getNextBetaVersionName()} 🚧`,
            },
          },
        },
        blog: {
          // routeBasePath: '/',
          path: 'blog',
          editUrl: ({locale, blogDirPath, blogPath}) => {
            if (locale !== 'en') {
              return `https://crowdin.com/project/docusaurus-v2/${locale}`;
            }
            return `https://github.com/facebook/docusaurus/edit/main/website/${blogDirPath}/${blogPath}`;
          },
          postsPerPage: 5,
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
          },
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All our posts',
        },
        pages: {
          remarkPlugins: [npm2yarn],
        },
        theme: {
          customCss: [require.resolve('./src/css/custom.css')],
        },
        gtag: !isDeployPreview
          ? {
              trackingID: 'UA-141789564-1',
            }
          : undefined,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      liveCodeBlock: {
        playgroundPosition: 'bottom',
      },
      hideableSidebar: true,
      autoCollapseSidebarCategories: true,
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      announcementBar: {
        id: 'announcementBar-2', // Increment on change
        content: `⭐️ If you like Docusaurus, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/facebook/docusaurus">GitHub</a> and follow us on <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/docusaurus" >Twitter</a> ${TwitterSvg}`,
      },
      prism: {
        // We need to load markdown again so that YAML is loaded before MD
        // and the YAML front matter is highlighted correctly.
        // TODO after we have forked prism-react-renderer, we should tweak the
        // import order and fix it there
        additionalLanguages: ['java', 'markdown'],
      },
      image: 'img/docusaurus-soc.png',
      // metadata: [{name: 'twitter:card', content: 'summary'}],
      algolia: {
        appId: 'X1Z85QJPUV',
        apiKey: 'bf7211c161e8205da2f933a02534105a',
        indexName: 'docusaurus-2',
      },
      navbar: {
        hideOnScroll: true,
        title: 'Docusaurus',
        logo: {
          alt: 'Docusaurus Logo',
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
          // right
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
            dropdownItemsAfter: [
              ...ArchivedVersionsDropdownItems.map(
                ([versionName, versionUrl]) => ({
                  label: versionName,
                  href: versionUrl,
                }),
              ),
              {
                href: 'https://v1.docusaurus.io',
                label: '1.x.x',
              },
              {
                to: '/versions',
                label: 'All versions',
              },
            ],
          },
          {
            type: 'localeDropdown',
            position: 'right',
            dropdownItemsAfter: [
              {
                href: 'https://github.com/facebook/docusaurus/issues/3526',
                label: 'Help Us Translate',
              },
            ],
          },
          {
            href: 'https://github.com/facebook/docusaurus',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {
                label: 'Introduction',
                to: 'docs',
              },
              {
                label: 'Installation',
                to: 'docs/installation',
              },
              {
                label: 'Migration from v1 to v2',
                to: 'docs/migration',
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
                label: 'Feature Requests',
                to: '/feature-requests',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Help',
                to: '/community/support',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: 'blog',
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
            // Please do not remove the privacy and terms, it's a legal requirement.
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
                label: 'Data Policy',
                href: 'https://opensource.facebook.com/legal/data-policy/',
              },
              {
                label: 'Cookie Policy',
                href: 'https://opensource.facebook.com/legal/cookie-policy/',
              },
            ],
          },
        ],
        logo: {
          alt: 'Facebook Open Source Logo',
          src: 'img/oss_logo.png',
          width: 160,
          height: 51,
          href: 'https://opensource.facebook.com',
        },
        copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc. Built with Docusaurus.`,
      },
    }),
};

async function createConfig() {
  const FeatureRequestsPlugin = (
    await import('./src/featureRequests/FeatureRequestsPlugin.mjs')
  ).default;
  const configTabs = (await import('./src/remark/configTabs.mjs')).default;
  const lightTheme = (await import('./src/utils/prismLight.mjs')).default;
  const darkTheme = (await import('./src/utils/prismDark.mjs')).default;
  const katex = (await import('rehype-katex')).default;
  config.plugins?.push(FeatureRequestsPlugin);
  // @ts-expect-error: we know it exists, right
  config.presets[0][1].docs.remarkPlugins.push(configTabs);
  // @ts-expect-error: we know it exists, right
  config.themeConfig.prism.theme = lightTheme;
  // @ts-expect-error: we know it exists, right
  config.themeConfig.prism.darkTheme = darkTheme;
  // @ts-expect-error: we know it exists, right
  config.presets[0][1].docs.rehypePlugins.push(katex);
  return config;
}

module.exports = createConfig;
