/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

// Need to be inlined to prevent dark mode FOUC
// Make sure that the 'storageKey' is the same as the one in `/theme/hooks/useTheme.js`
const storageKey = 'theme';
const noFlash = `(function() {
  function setDataThemeAttribute(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function getPreferredTheme() {
    var theme = null;
    try {
      theme = localStorage.getItem('${storageKey}');
    } catch (err) {}

    return theme;
  }

  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkQuery.addListener(function(e) {
    if (getPreferredTheme() !== null) {
      return;
    }

    setDataThemeAttribute(e.matches ? 'dark' : '');
  });

  var preferredTheme = getPreferredTheme();
  if (preferredTheme !== null) {
    setDataThemeAttribute(preferredTheme);
  } else if (darkQuery.matches) {
    setDataThemeAttribute('dark');
  }
})();`;

module.exports = function(context, options) {
  const {
    siteConfig: {themeConfig},
  } = context;
  const {disableDarkMode = false} = themeConfig || {};
  const {customCss} = options || {};
  return {
    name: 'docusaurus-theme-classic',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    getClientModules() {
      return [
        'infima/dist/css/default/default.css',
        'remark-admonitions/styles/infima.css',
        customCss,
      ];
    },

    injectHtmlTags() {
      if (disableDarkMode) {
        return {};
      }
      return {
        preBodyTags: [
          {
            tagName: 'script',
            attributes: {
              type: 'text/javascript',
            },
            innerHTML: noFlash,
          },
        ],
      };
    },
  };
};
