/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const Module = require('module');
const {validateThemeConfig} = require('./validateThemeConfig');

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

    getClientModules() {
      const modules = [
        require.resolve('infima/dist/css/default/default.css'),
        path.resolve(__dirname, './prism-include-languages'),
      ];

      if (customCss) {
        modules.push(customCss);
      }

      return modules;
    },

    configureWebpack() {
      const prismLanguages = additionalLanguages
        .map((lang) => `prism-${lang}`)
        .join('|');

      return {
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

module.exports.validateThemeConfig = validateThemeConfig;
