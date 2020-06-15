/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const Module = require('module');

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
const noFlash = ({defaultDarkMode = false, respectUserPreference = false}) => {
  return `(function() {
  var defaultDarkMode = ${defaultDarkMode};
  var respectUserPreference = ${respectUserPreference};

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
  }
  else {
    if ( respectUserPreference && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
      setDataThemeAttribute('dark');
    }
    else if ( respectUserPreference && window.matchMedia('(prefers-color-scheme: light)').matches ) {
      setDataThemeAttribute('light');
    }
    else {
      setDataThemeAttribute(defaultDarkMode ? 'dark' : 'light');
    }
  }
})();`;
};

module.exports = function (context, options) {
  const {
    siteConfig: {themeConfig},
  } = context;
  const {
    colorMode: {defaultDarkMode = false, respectUserPreference = false} = {},
    prism: {additionalLanguages = []} = {},
  } = themeConfig || {};
  const {customCss} = options || {};

  return {
    name: 'docusaurus-theme-classic',

    getThemePath() {
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
            innerHTML: noFlash({
              defaultDarkMode,
              respectUserPreference,
            }),
          },
        ],
      };
    },
  };
};
