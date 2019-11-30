/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

// Need to be inlined to prevent dark mode FOUC
const noFlash = `(function() {
  var storageKey = 'theme';

  function setDataThemeAttribute(theme) {
    document.querySelector('html').setAttribute('data-theme', theme);
  }
  
  var preferDarkQuery = '(prefers-color-scheme: dark)';
  var mql = window.matchMedia(preferDarkQuery);
  var supportsColorSchemeQuery = mql.media === preferDarkQuery;
  var localStorageTheme = null;
  try {
    localStorageTheme = localStorage.getItem(storageKey);
  } catch (err) {}
  var localStorageExists = localStorageTheme !== null;

  if (localStorageExists) {
    setDataThemeAttribute(localStorageTheme);
  } else if (supportsColorSchemeQuery) {
    var theme = mql.matches ? 'dark' : '';
    setDataThemeAttribute(theme);
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
      return ['infima/dist/css/default/default.css', customCss];
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
