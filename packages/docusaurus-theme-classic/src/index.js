/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

const noFlash = `(function() {
  // Change these if you use something different in your hook.
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

  // Determine the source of truth
  if (localStorageExists) {
    // source of truth from localStorage
    setDataThemeAttribute(localStorageTheme);
  } else if (supportsColorSchemeQuery) {
    // source of truth from system
    var theme = mql.matches ? 'dark' : '';
    setDataThemeAttribute(theme);
    localStorage.setItem(storageKey, theme);
  } else {
    // source of truth from document
    var theme = document.querySelector('html').getAttribute('data-theme');
    localStorage.setItem(storageKey, theme);
  }
})();`;

module.exports = function(context, options) {
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
