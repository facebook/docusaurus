/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {keyBy} = require('lodash');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Module = require('module');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {validateThemeConfig} = require('./validateThemeConfig');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {DEFAULT_PLUGIN_ID} = require('@docusaurus/core/lib/constants');

const createRequire = Module.createRequire || Module.createRequireFromPath;
const requireFromDocusaurusCore = createRequire(
  require.resolve('@docusaurus/core/package.json'),
);
const ContextReplacementPlugin = requireFromDocusaurusCore(
  'webpack/lib/ContextReplacementPlugin',
);

// Need to be inlined to prevent dark mode FOUC
// Make sure that the 'storageKey' is the same as the one in `/theme/hooks/useTheme.js`
const storageKey = 'theme';
const noFlashColorMode = ({defaultMode, respectPrefersColorScheme}) => {
  return `(function() {
  var defaultMode = '${defaultMode}';
  var respectPrefersColorScheme = ${respectPrefersColorScheme};

  function setDataThemeAttribute(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function getStoredTheme() {
    var theme = null;
    try {
      theme = localStorage.getItem('${storageKey}');
    } catch (err) {}
    return theme;
  }

  var storedTheme = getStoredTheme();
  if (storedTheme !== null) {
    setDataThemeAttribute(storedTheme);
  } else {
    if (
      respectPrefersColorScheme &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setDataThemeAttribute('dark');
    } else if (
      respectPrefersColorScheme &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      setDataThemeAttribute('light');
    } else {
      setDataThemeAttribute(defaultMode === 'dark' ? 'dark' : 'light');
    }
  }
})();`;
};

module.exports = function (context, options) {
  const {
    siteConfig: {themeConfig},
  } = context;
  const {colorMode, prism: {additionalLanguages = []} = {}} = themeConfig || {};
  const {customCss} = options || {};

  return {
    name: 'docusaurus-theme-classic',

    getThemePath() {
      return path.join(__dirname, '..', 'lib', 'theme');
    },

    getTypeScriptThemePath() {
      return path.resolve(__dirname, './theme');
    },

    async getTranslations() {
      //  TODO POC code
      return {
        navbar: {
          items: keyBy(
            themeConfig.navbar.items.map((item) => item.label).filter(Boolean),
            (label) => label,
          ),
        },
        footer: {
          links: themeConfig.footer.links.map((linkColumn) => ({
            title: linkColumn.title,
            labels: keyBy(
              linkColumn.items.map((item) => item.label).filter(Boolean),
              (label) => label,
            ),
          })),
        },
      };
    },

    translateThemeConfig() {
      const translations =
        context.i18n.translations.plugins?.[this.name]?.[DEFAULT_PLUGIN_ID];

      return {
        ...themeConfig,
        navbar: {
          ...themeConfig.navbar,
          items: themeConfig.navbar.items.map((item) => ({
            ...item,
            label: translations?.navbar?.items?.[item.label] ?? item.label,
          })),
        },
        footer: {
          ...themeConfig.footer,
          links: themeConfig.footer.links.map((linkColumn, index) => ({
            ...linkColumn,
            title:
              translations?.footer?.links?.[index]?.title ?? linkColumn.title,
            items: themeConfig.footer.links[index].items.map((item) => ({
              ...item,
              label:
                translations?.footer?.links?.[index]?.labels?.[item.label] ??
                item.label,
            })),
          })),
        },
      };
    },

    getClientModules() {
      const modules = [
        require.resolve('infima/dist/css/default/default.css'),
        path.resolve(__dirname, './prism-include-languages'),
      ];

      if (customCss) {
        if (Array.isArray(customCss)) {
          modules.push(...customCss);
        } else {
          modules.push(customCss);
        }
      }

      return modules;
    },

    configureWebpack() {
      const prismLanguages = additionalLanguages
        .map((lang) => `prism-${lang}`)
        .join('|');

      return {
        stats: {
          warningsFilter: [
            // See https://github.com/facebook/docusaurus/pull/3382
            (warning) =>
              warning.includes("Can't resolve '@theme-init/hooks/useDocs"),
          ],
        },
        plugins: [
          new ContextReplacementPlugin(
            /prismjs[\\/]components$/,
            new RegExp(`^./(${prismLanguages})$`),
          ),
        ],
      };
    },

    injectHtmlTags() {
      return {
        preBodyTags: [
          {
            tagName: 'script',
            attributes: {
              type: 'text/javascript',
            },
            innerHTML: noFlashColorMode(colorMode),
          },
        ],
      };
    },
  };
};

const swizzleAllowedComponents = [
  'CodeBlock',
  'DocSidebar',
  'Footer',
  'NotFound',
  'SearchBar',
  'hooks/useTheme',
  'prism-include-languages',
];

module.exports.getSwizzleComponentList = () => swizzleAllowedComponents;

module.exports.validateThemeConfig = validateThemeConfig;
